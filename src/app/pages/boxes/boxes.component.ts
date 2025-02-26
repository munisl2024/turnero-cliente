import { Component } from '@angular/core';
import { BoxesService } from '../../services/boxes.service';
import { AlertService } from '../../services/alert.service';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalComponent } from '../../components/modal/modal.component';
import { PastillaEstadoComponent } from '../../components/pastilla-estado/pastilla-estado.component';
import { TarjetaListaComponent } from '../../components/tarjeta-lista/tarjeta-lista.component';
import { FechaPipe } from '../../pipes/fecha.pipe';
import AbmBoxesComponent from './abm-boxes/abm-boxes.component';
import { PermisosDirective } from '../../directives/permisos.directive';
import { FiltroBoxesPipe } from '../../pipes/filtro-boxes.pipe';

@Component({
  standalone: true,
  selector: 'app-boxes',
  imports: [
    CommonModule,
    FormsModule,
    FechaPipe,
    ModalComponent,
    NgxPaginationModule,
    RouterModule,
    PastillaEstadoComponent,
    TarjetaListaComponent,
    AbmBoxesComponent,
    FiltroBoxesPipe,
    PermisosDirective
  ],
  templateUrl: './boxes.component.html',
})
export default class BoxesComponent {

   // Permisos
   public permiso_escritura: string[] = ['BOXES_ALL'];

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
     public boxesService: BoxesService,
     private alertService: AlertService,
     private dataService: DataService
   ) { }
 
   ngOnInit(): void {
     this.dataService.ubicacionActual = 'Dashboard - Boxes';
     this.alertService.loading();
     this.listarBoxes();
   }
 
   abrirAbm(estado: 'crear' | 'editar', box: any = null): void {
     this.boxesService.abrirAbm(estado, box);
   }
 
   // Listar boxes
   listarBoxes(): void {
     const parametros: any = {
       direccion: this.ordenar.direccion,
       columna: this.ordenar.columna
     }
     this.boxesService.listarBoxes(parametros).subscribe({
       next: ({ boxes }) => {
         this.boxesService.boxes = boxes;
         this.alertService.close();
       }, error: ({ error }) => this.alertService.errorApi(error.message)
     });
   }
 
   nuevoBox(box): void {
     this.boxesService.boxes = [box, ...this.boxesService.boxes];
     this.alertService.close();
   }
 
   actualizarBox(box): void {
     const index = this.boxesService.boxes.findIndex((b: any) => b.id === box.id);
     this.boxesService.boxes[index] = box;
     this.boxesService.boxes = [... this.boxesService.boxes];
     this.alertService.close();
   }
 
   // Actualizar estado Activo/Inactivo
   actualizarEstado(box: any): void {
 
     const { id, activo } = box;
 
     this.alertService.question({ msg: box.activo ? 'Baja de elemento' : 'Alta de elemento', buttonText: box.activo ? 'Dar de baja' : 'Dar de alta' })
       .then(({ isConfirmed }) => {
         if (isConfirmed) {
           this.alertService.loading();
           if(box.activo) {
            this.boxesService.bajaBox(id).subscribe({
              next: () => {
                this.listarBoxes();
              }, error: ({ error }) => this.alertService.errorApi(error.message)
            })
           } else {
            this.boxesService.altaBox(id).subscribe({
              next: () => {
                this.listarBoxes();
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
     this.listarBoxes();
   }

}
