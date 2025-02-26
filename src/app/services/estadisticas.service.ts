import { Injectable } from '@angular/core';
import { environments } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const urlApi = environments.base_url + '/estadisticas';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  get getToken(): any {
    return { 'Authorization': localStorage.getItem('token') }
  }

  constructor(private http: HttpClient) { }

  getTotales(
    {
      fechaInicio = '',
      fechaFin = '',
      idTramite = '',
      idUsuario = '',
      idBox = ''
    }
  ): Observable<any> {
    return this.http.get(`${urlApi}/totales`, {
      headers: this.getToken,
      params: {
        fechaInicio,
        fechaFin,
        idTramite,
        idUsuario,
        idBox
      }
    })
  }

  getTiemposPromedios(
    {
      fechaInicio = '',
      fechaFin = '',
      idTramite = '',
      idUsuario = '',
      idBox = ''
    }
  ): Observable<any> {
    return this.http.get(`${urlApi}/tiempos-promedios`, {
      headers: this.getToken,
      params: {
        fechaInicio,
        fechaFin,
        idTramite,
        idUsuario,
        idBox
      }
    })
  }

}
