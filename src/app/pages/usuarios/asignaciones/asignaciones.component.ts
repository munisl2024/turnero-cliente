import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { AlertService } from '../../../services/alert.service';
import { UsuariosToTramitesService } from '../../../services/usuarios-to-tramites.service';
import { UsuariosToBoxesService } from '../../../services/usuarios-to-boxes.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../components/modal/modal.component';
import { TramitesService } from '../../../services/tramites.service';
import { BoxesService } from '../../../services/boxes.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-asignaciones',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ModalComponent
  ],
  templateUrl: './asignaciones.component.html',
})
export default class AsignacionesComponent {

  public usuario: any;
  public tramitesAsignados: any[] = [];
  public boxesAsignados: any[] = [];

  public cargandoTramitesAsignados = true;
  public cargandoBoxesAsignados = true;

  // Modal: Asignar tramite
  public showModalAsignarTramite = false;
  public tramitesListado: any[] = [];
  public tramitesListadoSinRepetir: any[] = [];
  public cantidadTramitesSeleccionados = 0;
  public cantidadTramitesSeleccionadosEliminar = 0;
  // Modal: Asignar boxes
  public showModalAsignarBox = false;
  public boxesListado: any[] = [];
  public boxesListadoSinRepetir: any[] = [];
  public cantidadBoxesSeleccionados = 0;
  public cantidadBoxesSeleccionadosEliminar = 0;

  constructor(
    private authService: AuthService,
    private usuariosService: UsuariosService,
    private tramitesService: TramitesService,
    private boxesService: BoxesService,
    private usuariosToTramitesService: UsuariosToTramitesService,
    private usuariosToBoxesService: UsuariosToBoxesService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) { }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    this.showModalAsignarTramite = false;
    this.showModalAsignarBox = false;
  }
  
  ngOnInit() {
    this.alertService.loading();
    this.route.params.subscribe(({ id }) => {
      this.obtenerUsuarios(id);
      this.alertService.close();
    });
    this.obtenerTramitesListado();
    this.obtenerBoxesListado();
  }

  obtenerUsuarios(idUsuario: string) {
    this.usuariosService.getUsuario(idUsuario).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.obtenerTramitesAsignados(idUsuario);
        this.obtenerBoxesAsignados(idUsuario);
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  obtenerTramitesAsignados(idUsuario: string) {
    this.cargandoTramitesAsignados = true;
    this.usuariosToTramitesService.listarRelaciones({ idUsuario }).subscribe({
      next: ({ usuariosToTramites }) => {
        this.tramitesAsignados = usuariosToTramites;

        // Agregar el campo seleccionado = false a cada tramite
        this.tramitesAsignados = this.tramitesAsignados.map((tramite: any) => ({
          ...tramite,
          seleccionado: false
        }));

        this.cargandoTramitesAsignados = false;
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  obtenerBoxesAsignados(idUsuario: string) {
    this.cargandoBoxesAsignados = true;
    this.usuariosToBoxesService.listarRelaciones({ idUsuario }).subscribe({
      next: ({ usuariosToBoxes }) => {
        this.boxesAsignados = usuariosToBoxes;

        // Agregar el campo seleccionado = false a cada box
        this.boxesAsignados = this.boxesAsignados.map((box: any) => ({
          ...box,
          seleccionado: false
        }));

        this.cargandoBoxesAsignados = false;
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  obtenerTramitesListado() {
    this.tramitesService.listarTramites({ activo: 'true' }).subscribe({
      next: ({ tramites }) => {

        // Agregando seleccionado = false a cada tramite
        this.tramitesListado = tramites.map((tramite: any) => ({
          ...tramite,
          seleccionado: false
        }));

      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  obtenerBoxesListado() {
    this.boxesService.listarBoxes({ activo: 'true' }).subscribe({
      next: ({ boxes }) => {

        // Agregando seleccionado = false a cada box
        this.boxesListado = boxes.map((box: any) => ({
          ...box,
          seleccionado: false
        }));

      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  seleccionarTramite(tramite: any) {
    tramite.seleccionado = !tramite.seleccionado;
    this.cantidadTramitesSeleccionados = this.tramitesListado.filter((tramite: any) => tramite.seleccionado).length;
  }

  seleccionarBox(box: any) {
    box.seleccionado = !box.seleccionado;
    this.cantidadBoxesSeleccionados = this.boxesListado.filter((box: any) => box.seleccionado).length;
  }

  seleccionarTramiteEliminar(tramite: any) {
    tramite.seleccionado = !tramite.seleccionado;
    this.cantidadTramitesSeleccionadosEliminar = this.tramitesAsignados.filter((tramite: any) => tramite.seleccionado).length;
  }

  seleccionarBoxEliminar(box: any) {
    box.seleccionado = !box.seleccionado;
    this.cantidadBoxesSeleccionadosEliminar = this.boxesAsignados.filter((box: any) => box.seleccionado).length;
  }

  abrirModalAsignarTramite() {
    this.cantidadTramitesSeleccionados = 0;
    this.showModalAsignarTramite = true;
    this.tramitesListado.forEach((tramite: any) => {
      tramite.seleccionado = false;
    });
    // Eliminamos los trámites que ya tiene asignado el usuario
    this.tramitesListadoSinRepetir = this.tramitesListado.filter((tramite: any) => !this.tramitesAsignados.some((t: any) => t.idTramite === tramite.id));
  }

  abrirModalAsignarBox() {
    this.cantidadBoxesSeleccionados = 0;
    this.showModalAsignarBox = true;
    this.boxesListado.forEach((box: any) => {
      box.seleccionado = false;
    });
    // Eliminamos los boxes que ya tiene asignado el usuario
    this.boxesListadoSinRepetir = this.boxesListado.filter((box: any) => !this.boxesAsignados.some((b: any) => b.idBox === box.id));
  }

  cerrarModalAsignarTramite() {
    this.showModalAsignarTramite = false;
  }

  cerrarModalAsignarBox() {
    this.showModalAsignarBox = false;
  }

  asignarTramites() {

    // verificamos que haya al menos un trámite seleccionado
    if (this.cantidadTramitesSeleccionados <= 0) {
      this.alertService.info('Debe seleccionar al menos un trámite');
      return;
    }

    this.alertService.question({ msg: 'Asignando elementos', buttonText: 'Aceptar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {

          this.alertService.loading();

          // Recorremos los trámites seleccionados y creamos un array con los idTramites
          const idTramites = this.tramitesListado.filter((tramite: any) => tramite.seleccionado).map((tramite: any) => tramite.id);

          // Creamos un objeto con los datos necesarios para la asignación
          const data = {
            idUsuario: this.usuario.id,
            idTramites: idTramites,
            creatorUserId: this.authService.usuario.userId
          }

          this.usuariosToTramitesService.nuevasRelaciones(data).subscribe({
            next: () => {
              this.alertService.close();
              this.showModalAsignarTramite = false;
              this.obtenerTramitesAsignados(this.usuario.id);
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })

        }
      });


  }

  asignarBoxes() {

    // verificamos que haya al menos un box seleccionado
    if (this.cantidadBoxesSeleccionados <= 0) {
      this.alertService.info('Debe seleccionar al menos un box');
      return;
    }

    this.alertService.question({ msg: 'Asignando elementos', buttonText: 'Aceptar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {

          this.alertService.loading();

          // Recorremos los boxes seleccionados y creamos un array con los idBoxes
          const idBoxes = this.boxesListado.filter((box: any) => box.seleccionado).map((box: any) => box.id);

          // Creamos un objeto con los datos necesarios para la asignación
          const data = {
            idUsuario: this.usuario.id,
            idBoxes: idBoxes,
            creatorUserId: this.authService.usuario.userId
          }

          this.usuariosToBoxesService.nuevasRelaciones(data).subscribe({
            next: () => {
              this.alertService.close();
              this.showModalAsignarBox = false;
              this.obtenerBoxesAsignados(this.usuario.id);
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })

        }
      });

  }

  eliminarTramites() {
    
    // Verificamos que haya al menos un trámite seleccionado para eliminar
    if (this.cantidadTramitesSeleccionadosEliminar <= 0) {
      this.alertService.info('Debe seleccionar al menos un trámite');
      return;
    }
    
    this.alertService.question({ msg: 'Eliminando elementos', buttonText: 'Aceptar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {

          this.alertService.loading();

          // Recorremos los trámites seleccionados y creamos un array con los idTramites
          const idTramites = this.tramitesAsignados.filter((tramite: any) => tramite.seleccionado).map((tramite: any) => tramite.id);

          // Creamos un objeto con los datos necesarios para la eliminación
          const data = { idTramites: idTramites }

          this.usuariosToTramitesService.eliminarRelaciones(data).subscribe({
            next: () => {
              this.alertService.close();
              this.obtenerTramitesAsignados(this.usuario.id);
              this.cantidadTramitesSeleccionadosEliminar = 0;
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });


  }

  eliminarBoxes() {

    // Verificamos que haya al menos un box seleccionado para eliminar
    if (this.cantidadBoxesSeleccionadosEliminar <= 0) {
      this.alertService.info('Debe seleccionar al menos un box');
      return;
    }

    this.alertService.question({ msg: 'Eliminando elementos', buttonText: 'Aceptar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {

          this.alertService.loading();

          // Recorremos los boxes seleccionados y creamos un array con los idBoxes
          const idBoxes = this.boxesAsignados.filter((box: any) => box.seleccionado).map((box: any) => box.id);

          // Creamos un objeto con los datos necesarios para la eliminación
          const data = { idBoxes: idBoxes }

          this.usuariosToBoxesService.eliminarRelaciones(data).subscribe({
            next: () => {
              this.alertService.close();
              this.cantidadBoxesSeleccionadosEliminar = 0;
              this.obtenerBoxesAsignados(this.usuario.id);
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })

        }
      });


  }

}
