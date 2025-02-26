import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments';
import { Observable } from 'rxjs';

const urlApi = environments.base_url + '/boxes';

@Injectable({
  providedIn: 'root'
})
export class BoxesService {

  public estadoAbm: 'crear' | 'editar' = 'crear';
  public showModalAbm = false;
  public boxes: any[] = [];
  public boxSeleccionado: any = null;
  public abmForm = { descripcion: '' };

  get getToken(): any {
    return { 'Authorization': localStorage.getItem('token') }
  }

  constructor(private http: HttpClient) { }

  getBox(id: string): Observable<any> {
    return this.http.get(`${urlApi}/${id}`, {
      headers: this.getToken
    })
  }

  listarBoxes({
    direccion = 'asc',
    columna = 'descripcion',
    activo = ''
  }): Observable<any> {
    return this.http.get(urlApi, {
      params: {
        direccion: String(direccion),
        columna,
        activo
      },
      headers: this.getToken
    })
  }

  nuevoBox(data: any): Observable<any> {
    return this.http.post(urlApi, data, {
      headers: this.getToken
    })
  }

  actualizarBox(id: string, data: any): Observable<any> {
    return this.http.patch(`${urlApi}/${id}`, data, {
      headers: this.getToken
    })
  }

  bajaBox(id: string): Observable<any> {
    return this.http.patch(`${urlApi}/baja/${id}`,{ }, {
      headers: this.getToken
    })
  }

  altaBox(id: string): Observable<any> {
    return this.http.patch(`${urlApi}/alta/${id}`,{ }, {
      headers: this.getToken
    })
  }

  abrirAbm(estado: 'crear' | 'editar', box: any = null): void {
    this.estadoAbm = estado;
    this.boxSeleccionado = box;
    this.showModalAbm = true;
    if (estado === 'editar') {
      this.abmForm = { descripcion: box.descripcion }
    } else {
      this.abmForm = { descripcion: '' }
    }
  }

}
