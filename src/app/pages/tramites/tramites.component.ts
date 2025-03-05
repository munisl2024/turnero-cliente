import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { PastillaEstadoComponent } from '../../components/pastilla-estado/pastilla-estado.component';
import { TarjetaListaComponent } from '../../components/tarjeta-lista/tarjeta-lista.component';
import { PermisosDirective } from '../../directives/permisos.directive';
import { FechaPipe } from '../../pipes/fecha.pipe';
import { FiltroTramitesPipe } from '../../pipes/filtro-tramites.pipe';
import { AbmTramitesComponent } from './abm-tramites/abm-tramites.component';
import { AlertService } from '../../services/alert.service';
import { DataService } from '../../services/data.service';
import { TramitesService } from '../../services/tramites.service';

@Component({
  standalone: true,
  selector: 'app-tramites',
  imports: [
    CommonModule,
    FormsModule,
    FechaPipe,
    NgxPaginationModule,
    RouterModule,
    PastillaEstadoComponent,
    TarjetaListaComponent,
    AbmTramitesComponent,
    FiltroTramitesPipe,
    PermisosDirective
  ],
  templateUrl: './tramites.component.html',
})
export default class TramitesComponent {

  // Permisos
  public permiso_escritura: string[] = ['TRAMITES_ALL'];

  // Paginacion
  public paginaActual: number = 1;
  public cantidadItems: number = 10;

  // Filtrado
  public filtro = {
    activo: 'true',
    parametro: ''
  }

  // Ordenar
  public ordenar = {
    direccion: 'asc',  // Asc (1) | Desc (-1)
    columna: 'descripcion'
  }

  constructor(
    public tramitesService: TramitesService,
    private alertService: AlertService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.dataService.ubicacionActual = 'Dashboard - Trámites';
    this.alertService.loading();
    this.listarTramites();
  }

  abrirAbm(estado: 'crear' | 'editar', tramite: any = null): void {
    this.tramitesService.abrirAbm(estado, tramite);
  }

  // Listar trámites
  listarTramites(): void {
    const parametros: any = {
      direccion: this.ordenar.direccion,
      columna: this.ordenar.columna
    }
    this.tramitesService.listarTramites(parametros).subscribe({
      next: ({ tramites }) => {
        this.tramitesService.tramites = tramites;
        this.alertService.close();
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    });
  }

  nuevoTramite(tramite): void {
    this.tramitesService.tramites = [tramite, ...this.tramitesService.tramites];
    this.alertService.close();
  }

  actualizarTramite(tramite): void {
    const index = this.tramitesService.tramites.findIndex((t: any) => t.id === tramite.id);
    this.tramitesService.tramites[index] = tramite;
    this.tramitesService.tramites = [... this.tramitesService.tramites];
    this.alertService.close();
  }

  // Actualizar estado Activo/Inactivo
  actualizarEstado(tramite: any): void {

    const { id, activo } = tramite;

    this.alertService.question({ msg: tramite.activo ? 'Baja de trámite' : 'Alta de trámite', buttonText: tramite.activo ? 'Dar de baja' : 'Dar de alta' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          if (tramite.activo) {
            this.tramitesService.bajaTramite(id).subscribe({
              next: () => {
                this.listarTramites();
              }, error: ({ error }) => this.alertService.errorApi(error.message)
            })
          } else {
            this.tramitesService.altaTramite(id).subscribe({
              next: () => {
                this.listarTramites();
              }, error: ({ error }) => this.alertService.errorApi(error.message)
            })
          }
        }
      });
  }

  // Filtrar Activo/Inactivo
  filtrarActivos(activo: any): void {
    this.paginaActual = 1;
    this.filtro.activo = activo;
  }

  // Filtrar por Parametro
  filtrarParametro(parametro: string): void {
    this.paginaActual = 1;
    this.filtro.parametro = parametro;
  }

  // Ordenar por columna
  ordenarPorColumna(columna: string) {
    this.ordenar.columna = columna;
    this.ordenar.direccion = this.ordenar.direccion == 'asc' ? 'desc' : 'asc';
    this.alertService.loading();
    this.listarTramites();
  }

}
