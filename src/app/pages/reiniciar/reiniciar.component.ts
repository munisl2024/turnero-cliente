import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColaService } from '../../services/cola.service';
import { AlertService } from '../../services/alert.service';
import { gsap } from 'gsap';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-reiniciar',
  standalone: true,
  imports: [],
  templateUrl: './reiniciar.component.html',
})
export default class ReiniciarComponent implements OnInit, OnDestroy {

  constructor(
    private colaService: ColaService,
    private alertService: AlertService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .2 });
    this.webSocketConexion();
  }

  ngOnDestroy() {
    this.socketService.desconectar();
  }

  webSocketConexion(): void {
    this.socketService.conectar();
  }

  reiniciar() {
    this.alertService.question({ msg: 'Reiniciando turnero', buttonText: 'Reiniciar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          this.colaService.reiniciar().subscribe({
            next: () => {
              this.webSocketEmitirMensaje();
              this.alertService.success('Turnero reiniciado correctamente');
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });
  }

  webSocketEmitirMensaje(): void {
    this.socketService.emit('atender-turno', 'actualizar');
    this.socketService.emit('totem-turno', 'actualizar');
  }

}
