import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColaService } from '../../services/cola.service';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';
import { UsuariosToBoxesService } from '../../services/usuarios-to-boxes.service';
import { UsuariosToTramitesService } from '../../services/usuarios-to-tramites.service';
import { TramitesService } from '../../services/tramites.service';
import { BoxesService } from '../../services/boxes.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import gsap from 'gsap';
@Component({
  standalone: true,
  selector: 'app-atender',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './atender.component.html',
})
export default class AtenderComponent implements OnInit, OnDestroy {

  // Estado de BOX
  public estadoBox: string = 'Libre'; // Libre, Llamando, Atendiendo
  public turnoTomado: any = null;

  // Loadings
  public loadingCola: boolean = false;

  // Selectores
  public boxSeleccionado: any = '';
  public tramiteSeleccionado: any = '';

  // Listados
  public colaTotal: any[] = [];
  public cola: any[] = [];
  public boxes: any[] = [];
  public tramites: any[] = [];

  constructor(
    private authService: AuthService,
    private usuariosToBoxesService: UsuariosToBoxesService,
    private usuariosToTramitesService: UsuariosToTramitesService,
    private tramitesService: TramitesService,
    private boxesService: BoxesService,
    private colaService: ColaService,
    private alertService: AlertService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .2 });
    this.alertService.loading();
    this.webSocketConexion();
    if (this.authService.usuario.role == 'ADMIN_ROLE') {
      this.getListadoAdministrador();
    } else {
      this.getListadoEstandar();
    }
  }

  webSocketConexion(): void {

    // Se conecta a websocket
    this.socketService.conectar();

    // Se recibe el mensaje de que se saco un turno por totem
    this.socketService.listen('totem-turno').subscribe(() => {
      this.getTurnosPendientes();
    });

    // Se recibe el mensaje de que se atendio un turno
    this.socketService.listen('atender-turno').subscribe(() => {
      this.getTurnosPendientes();
    })

  }

  webSocketEmitirMensaje(mensaje: string = 'actualizar'): void {
    this.socketService.emit('atender-turno', { mensaje });
  }

  ngOnDestroy(): void {
    this.socketService.desconectar();
  }

  // Listado de tramites y boxes para el usuario estandar
  getListadoEstandar() {
    this.usuariosToBoxesService.listarRelaciones({}).subscribe({
      next: ({ usuariosToBoxes }) => {
        this.boxes = usuariosToBoxes.map((usuarioToBox: any) => {
          return {
            id: usuarioToBox.box.id,
            descripcion: usuarioToBox.box.descripcion
          }
        })
        this.boxes.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        if (this.boxes.length > 0) {
          this.boxSeleccionado = this.boxes[0].id;
        }
        this.usuariosToTramitesService.listarRelaciones({}).subscribe({
          next: ({ usuariosToTramites }) => {
            this.tramites = usuariosToTramites.map((usuarioToTramite: any) => {
              return {
                id: usuarioToTramite.tramite.id,
                descripcion: usuarioToTramite.tramite.descripcion
              }
            })
            this.tramites.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
            this.getTurnosPendientes();
            this.determinarEstado();
          },
          error: (error) => this.alertService.errorApi(error.message)
        })
      },
      error: (error) => this.alertService.errorApi(error.message)
    })
  }

  getListadoAdministrador() {
    this.boxesService.listarBoxes({ activo: 'true' }).subscribe({
      next: ({ boxes }) => {
        this.boxes = boxes;
        if (this.boxes.length > 0) {
          this.boxSeleccionado = this.boxes[0].id;
        }
        this.tramitesService.listarTramites({ activo: 'true' }).subscribe({
          next: ({ tramites }) => {
            this.tramites = tramites;
            this.getTurnosPendientes();
            this.determinarEstado();
          },
          error: (error) => this.alertService.errorApi(error.message)
        })
      },
      error: (error) => this.alertService.errorApi(error.message)
    })

  }

  getTurnosPendientes() {
    this.colaService.listarCola({
      estado: 'Pendiente'
    }).subscribe({
      next: ({ colas }) => {
        // Asignar a la cola solo turnos que tengan un tipo de tramite que este en el listado de tramites
        this.colaTotal = colas;
        if (this.tramiteSeleccionado == '') {
          this.cola = colas.filter((cola: any) => this.tramites.some((tramite: any) => tramite.id == cola.tramite.id));
        } else {
          this.cola = this.colaTotal.filter((cola: any) => cola.tramite.id == this.tramiteSeleccionado);
        }
        this.alertService.close();
      },
      error: (error) => this.alertService.errorApi(error.message)
    })
  }

  llamarProximoTurno() {

    const data = {
      idBox: Number(this.boxSeleccionado),
      idUsuario: Number(this.authService.usuario.userId),
      idTramite: this.tramiteSeleccionado !== '' ? Number(this.tramiteSeleccionado) : null
    }

    this.colaService.llamarProximoTurno(data).subscribe({
      next: ({ ultimoTurno }) => {
        this.estadoBox = ultimoTurno.estado;
        this.turnoTomado = ultimoTurno;
        this.webSocketEmitirMensaje('Llamando');
      },
      error: ({error}) => this.alertService.info(error.message)
    })

  }

  atenderTurno() {
    this.colaService.atenderTurno(this.turnoTomado.id).subscribe({
      next: ({ turnoAtendido }) => {
        this.estadoBox = turnoAtendido.estado;
        this.turnoTomado = turnoAtendido;
        this.webSocketEmitirMensaje('Atender');
      },
      error: (error) => this.alertService.errorApi(error.message)
    })
  }

  finalizarTurno() {
    this.colaService.finalizarTurno(this.turnoTomado.id).subscribe({
      next: () => {
        this.estadoBox = 'Libre'
        this.turnoTomado = null
        this.webSocketEmitirMensaje('Finalizando');
      },
      error: (error) => this.alertService.errorApi(error.message)
    })
  }

  determinarEstado() {
    this.colaService.estadoBox(this.boxSeleccionado).subscribe({
      next: ({ dataEstado }) => {
        this.estadoBox = dataEstado.estado;
        this.turnoTomado = dataEstado.turno;
        this.alertService.close();
      },
      error: (error) => this.alertService.errorApi(error.message)
    });
  }

  cambiarBox() {
    this.alertService.loading();
    this.determinarEstado();
  }

}
