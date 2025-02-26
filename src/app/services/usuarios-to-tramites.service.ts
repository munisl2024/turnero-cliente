import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const urlApi = environments.base_url + '/usuarios-to-tramites';

@Injectable({
  providedIn: 'root'
})
export class UsuariosToTramitesService {

  get getToken(): any {
    return { 'Authorization': localStorage.getItem('token') }
  }

  constructor(private http: HttpClient) { }

  getRelacion(id: string): Observable<any> {
    return this.http.get(`${urlApi}/${id}`, {
      headers: this.getToken
    })
  }

  listarRelaciones({
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
        activo
      },
      headers: this.getToken
    })
  }

  nuevaRelacion(data: any): Observable<any> {
    return this.http.post(urlApi, data, {
      headers: this.getToken
    })
  }

  nuevasRelaciones(data: any): Observable<any> {
    return this.http.post(urlApi + '/multi', data, {
      headers: this.getToken
    })
  }

  actualizarRelacion(id: string, data: any): Observable<any> {
    return this.http.patch(`${urlApi}/${id}`, data, {
      headers: this.getToken
    })
  }

  eliminarRelaciones(data: any): Observable<any> {
    return this.http.delete(`${urlApi}/multi`, {
      headers: this.getToken,
      body: data
    })
  }

}
