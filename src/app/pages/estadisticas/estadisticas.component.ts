import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EstadisticasService } from '../../services/estadisticas.service';
import { AlertService } from '../../services/alert.service';
import { gsap } from 'gsap';
import { FormsModule } from '@angular/forms';
import { BoxesService } from '../../services/boxes.service';
import { TramitesService } from '../../services/tramites.service';
import { format } from 'date-fns';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './estadisticas.component.html',
})
export default class EstadisticasComponent implements OnInit {

  public boxes = [];
  public tramites = [];
  public usuarios = [];
  public loading = {
    totales: true,
    tiempos: true
  };

  public totales = {
    totalTurnos: 0,
    totalesPorTramite: [],
  };

  public filtro = {
    fechaInicio: format(new Date(), 'yyyy-MM-dd'),
    fechaFin: format(new Date(), 'yyyy-MM-dd'),
    idBox: '',
    idTramite: '',
    idUsuario: '',
  };

  public tiemposPromedios = {
    atencion: 0,
    espera: 0,
    enEdificio: 0,
  };
  
  constructor(
    private estadisticasService: EstadisticasService,
    private usuariosService: UsuariosService,
    private alertService: AlertService,
    private boxesService: BoxesService,
    private tramitesService: TramitesService
  ) { }

  ngOnInit(): void {
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .2 });
    this.obtenerTotales();
    this.obtenerTiemposPromedios();
    this.obtenerBoxes();
    this.obtenerTramites();
    this.obtenerUsuarios();
  }

  obtenerTotales() {
    this.loading.totales = true;
    this.estadisticasService.getTotales({
      fechaInicio: this.filtro.fechaInicio,
      fechaFin: this.filtro.fechaFin,
      idBox: this.filtro.idBox,
      idTramite: this.filtro.idTramite,
      idUsuario: this.filtro.idUsuario,
    }).subscribe({
      next: ({ totales }) => {
        this.totales = {
          totalTurnos: totales.totalTurnos,
          totalesPorTramite: totales.totalesPorTramite,
        };
        this.loading.totales = false;
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    });
  } 

  obtenerTiemposPromedios() {
    this.loading.tiempos = true;
    this.estadisticasService.getTiemposPromedios({
      fechaInicio: this.filtro.fechaInicio,
      fechaFin: this.filtro.fechaFin,
      idBox: this.filtro.idBox,
      idTramite: this.filtro.idTramite,
      idUsuario: this.filtro.idUsuario,
    }).subscribe({
      next: ({ tiemposPromedios }) => {
        this.tiemposPromedios.atencion = tiemposPromedios.atencion >=0 ? tiemposPromedios.atencion : 0;
        this.tiemposPromedios.espera = tiemposPromedios.espera >=0 ? tiemposPromedios.espera : 0;
        this.tiemposPromedios.enEdificio = tiemposPromedios.enEdificio >=0 ? tiemposPromedios.enEdificio : 0;
        this.loading.tiempos = false;
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    });
  }

  obtenerBoxes() {
    this.boxesService.listarBoxes({}).subscribe({
      next: ({ boxes }) => {
        this.boxes = boxes;
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  obtenerTramites() {
    this.tramitesService.listarTramites({}).subscribe({
      next: ({ tramites }) => {
        this.tramites = tramites;
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  obtenerUsuarios() {
    this.usuariosService.listarUsuarios().subscribe({
      next: ({ usuarios }) => {
        this.usuarios = usuarios;
        this.usuarios = this.usuarios.filter(usuario => usuario.id !== 1);
      }, error: ({ error }) => this.alertService.errorApi(error.message)
    })
  }

  buscar() {
    this.loading.tiempos = true;
    this.loading.totales = true;
    this.obtenerTotales();
    this.obtenerTiemposPromedios();
  }

}