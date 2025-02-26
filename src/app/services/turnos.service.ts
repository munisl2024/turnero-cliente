import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const urlApi = environments.base_url + '/turnos';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

  get getToken(): any {
    return { 'Authorization': localStorage.getItem('token') }
  }

  constructor(private http: HttpClient) { }

  getTurno(id: string): Observable<any> {
    return this.http.get(`${urlApi}/${id}`, {
      headers: this.getToken
    })
  }

  listarTurnos({
    direccion = 'desc',
    columna = 'createdAt',
    idUsuario = '',
    activo = ''
  }): Observable<any> {
    return this.http.get(urlApi, {
      params: {
        direccion: String(direccion),
        columna,
        idUsuario,
        activo,
      },
    })
  }

  nuevoTurno(data: any): Observable<any> {
    return this.http.post(urlApi, data, {
    })
  }

  actualizarTurno(id: string, data: any): Observable<any> {
    return this.http.patch(`${urlApi}/${id}`, data, {
      headers: this.getToken
    })
  }

}
