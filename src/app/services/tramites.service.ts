import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const urlApi = environments.base_url + '/tramites';

@Injectable({
  providedIn: 'root'
})
export class TramitesService {

  public estadoAbm: 'crear' | 'editar' = 'crear';
  public showModalAbm = false;
  public tramites: any[] = [];
  public tramiteSeleccionado: any = null;
  public abmForm = { 
    descripcion: '', 
    identificador: '',
    iconoUrl: ''
  };

  get getToken(): any {
    return { 'Authorization': localStorage.getItem('token') }
  }

  constructor(private http: HttpClient) { }

  getTramite(id: string): Observable<any> {
    return this.http.get(`${urlApi}/${id}`, {
      headers: this.getToken
    })
  }

  listarTramites({
    direccion = 'asc',
    columna = 'descripcion',
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
    })
  }

  nuevoTramite(data: any): Observable<any> {
    return this.http.post(urlApi, data, {
      headers: this.getToken
    })
  }

  actualizarTramite(id: string, data: any): Observable<any> {
    return this.http.patch(`${urlApi}/${id}`, data, {
      headers: this.getToken
    })
  }

  abrirAbm(estado: 'crear' | 'editar', tramite: any = null): void {
    this.estadoAbm = estado;
    this.tramiteSeleccionado = tramite;
    this.showModalAbm = true;
    if (estado === 'editar') {
      this.abmForm = { 
        descripcion: tramite.descripcion, 
        identificador: tramite.identificador,
        iconoUrl: tramite.iconoUrl
      }
    } else {
      this.abmForm = { 
        descripcion: '', 
        identificador: '',
        iconoUrl: ''
      }
    }
  }

  bajaTramite(id: string): Observable<any> {
    return this.http.patch(`${urlApi}/baja/${id}`, { }, {
      headers: this.getToken
    })
  }

  altaTramite(id: string): Observable<any> {
    return this.http.patch(`${urlApi}/alta/${id}`, { }, {
      headers: this.getToken
    })
  }

}
