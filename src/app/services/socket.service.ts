import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environments } from '../../environments/environments';

const urlSocket = environments.base_url.replace('/api', '');

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  constructor() { }

  conectar() {
    this.socket = io(urlSocket);
    this.socket.on('welcome-message', (message: string) => {
      console.log(message);
    });
  }

  desconectar() {
    this.socket.disconnect();
  }

  // Escuchar eventos desde el servidor
  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  // Emitir eventos al servidor
  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }


}
