import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ColaService } from '../../services/cola.service';
import { AlertService } from '../../services/alert.service';
import { CommonModule } from '@angular/common';

import { SocketService } from '../../services/socket.service';
@Component({
  selector: 'app-pantalla',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './pantalla.component.html',
})
export default class PantallaComponent implements OnInit, OnDestroy {

  public estadoPantalla: any[] = [];

  constructor(
    private colaService: ColaService,
    private socketService: SocketService
  ){}

  @ViewChild('notificacion',{ static: true }) notificacion!: ElementRef<HTMLAudioElement>;

  ngOnInit(): void {
    this.actualizarPantalla();
    this.webSocketConexion();
  }

  webSocketConexion(): void {
    this.socketService.conectar();
    this.socketService.listen('atender-turno').subscribe(({ mensaje }) => {
      this.actualizarPantalla();
      if(mensaje == 'Llamando') {
        this.reproducirSonido();
      }
    })
  }
  
  actualizarPantalla() {
    this.colaService.estadoPantalla().subscribe({
      next: ({ estadoPantalla }) => {
        this.estadoPantalla = estadoPantalla;
      }
    })
  }

  ngOnDestroy(): void {
    this.socketService.desconectar();
  }

  reproducirSonido(): void {
    this.notificacion.nativeElement.play().catch(error => {
      console.error('Error al reproducir el sonido:', error);
    });
  }

}
