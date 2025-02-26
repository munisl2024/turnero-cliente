import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { TramitesService } from '../../services/tramites.service';
import { CommonModule } from '@angular/common';
import { ColaService } from '../../services/cola.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-totem',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './totem.component.html',
})
export default class TotemComponent implements OnInit, OnDestroy {

  public tramites: any[] = [];

  constructor(
    private alertService: AlertService,
    private colaService: ColaService,
    private tramitesService: TramitesService,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
    this.alertService.loading();
    this.webSocketConexion();
    this.obtenerTramites();
  }

  ngOnDestroy(): void {
    this.socketService.desconectar();
  }

  webSocketConexion(): void {
    this.socketService.conectar();
  }

  obtenerTramites(): void {
    this.tramitesService.listarTramites({ activo: 'true' }).subscribe({
      next: ({ tramites }) => {
        this.tramites = tramites;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  nuevoTurno(tramite: any): void {
    const data = {
      idTramite: tramite.id,
      idBox: 1, // SIN ASIGNAR
    }
    this.alertService.loading('Generando turno...');
    this.colaService.agregarACola(data).subscribe({
      next: () => {
        this.socketService.emit('totem-turno', 'actualizar');
        // Retardo de 2 segundos
        // setTimeout(() => {
        //   this.alertService.close();
        // }, 2000);
        this.alertService.close();
      },
      error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

}
