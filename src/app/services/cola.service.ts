import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

const urlApi = environments.base_url + '/cola';

@Injectable({
  providedIn: 'root'
})
export class ColaService {

  private socket: Socket;

  get getToken(): any {
    return { 'Authorization': localStorage.getItem('token') }
  }

  constructor(private http: HttpClient) {
    this.socket = io(environments.base_url);
    this.socket.on('connect', () => {
      console.log('Conectado al servidor de eventos');
    });
  }

  getCola(id: string): Observable<any> {
    return this.http.get(`${urlApi}/${id}`, {
      headers: this.getToken
    })
  }

  getTesting(): void {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor de eventos');
    });
  }
  

  listarCola({
    direccion = 'asc',
    columna = 'createdAt',
    idTramite = '',
    idBox = '',
    activo = '',
    estado = '',
  }): Observable<any> {
    return this.http.get(urlApi, {
      params: {
        direccion: String(direccion),
        columna,
        idTramite,
        idBox,
        activo,
        estado,
      },
    })
  }

  // Nuevo método para escuchar cambios en el estado de la pantalla
  estadoPantallaRealTime(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('estadoPantallaActualizado', (data: any) => {
        observer.next(data);
      });
    });
  }

  estadoPantalla(): Observable<any> {
    return this.http.get(`${urlApi}/estado/pantalla`, {})
  }

  estadoBox(id: number): Observable<any> {
    return this.http.get(`${urlApi}/estado-box/${id}`, {
      headers: this.getToken
    })
  }

  llamarProximoTurno(data: any): Observable<any> {
    return this.http.post(`${urlApi}/llamar-proximo-turno`, data, {
      headers: this.getToken
    })
  }

  atenderTurno(id: number): Observable<any> {
    return this.http.get(`${urlApi}/atender-turno/${id}`, {
      headers: this.getToken
    })
  }

  finalizarTurno(id: number): Observable<any> {
    return this.http.get(`${urlApi}/liberar-turno/${id}`, {
      headers: this.getToken
    })
  }

  agregarACola(data: any): Observable<any> {
    return this.http.post(urlApi, data, {})
  }

  actualizarCola(id: string, data: any): Observable<any> {
    return this.http.patch(`${urlApi}/${id}`, data, {
      headers: this.getToken
    })
  }

  reiniciar(): Observable<any> {
    return this.http.delete(urlApi, {
      headers: this.getToken
    })
  }

}
