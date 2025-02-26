import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '../../../components/modal/modal.component';
import { FechaPipe } from '../../../pipes/fecha.pipe';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { TramitesService } from '../../../services/tramites.service';

@Component({
  selector: 'app-abm-tramites',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FechaPipe,
    ModalComponent,
    RouterModule,
  ],
  templateUrl: './abm-tramites.component.html',
})
export class AbmTramitesComponent {

  @Output()
  public insertEvent = new EventEmitter<any>();

  @Output()
  public updateEvent = new EventEmitter<any>();

  public iconos: any[] = [
    {
      nombre: 'paper',
      url: 'assets/svg/iconos/paper.svg',
    },
    {
      nombre: 'bus',
      url: 'assets/svg/iconos/bus.svg',
    },
    {
      nombre: 'libre-deuda',
      url: 'assets/svg/iconos/libre-deuda.svg',
    },
    {
      nombre: 'water',
      url: 'assets/svg/iconos/water.svg',
    },
    {
      nombre: 'alumbrado',
      url: 'assets/svg/iconos/alumbrado.svg',
    },
    {
      nombre: 'electricidad',
      url: 'assets/svg/iconos/electricidad.svg',
    },
    {
      nombre: 'arboles',
      url: 'assets/svg/iconos/arboles.svg',
    },
  ]

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    this.tramitesService.showModalAbm = false;
  }

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    public tramitesService: TramitesService,
  ) { }

  ngOnInit() { }

  nuevoTramite(): void {

    // Verificacion
    if (this.tramitesService.abmForm.descripcion.trim() === '') return this.alertService.info('La descripción es obligatoria');
    if (this.tramitesService.abmForm.identificador.trim() === '') return this.alertService.info('El identificador es obligatorio');
    if (this.tramitesService.abmForm.iconoUrl.trim() === '') return this.alertService.info('Debe seleccionar un icono');

    this.alertService.question({ msg: 'Creando nuevo trámite', buttonText: 'Aceptar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          const data = {
            ...this.tramitesService.abmForm,
            creatorUserId: this.authService.usuario.userId,
          }
          this.tramitesService.nuevoTramite(data).subscribe({
            next: ({ tramite }) => {
              this.insertEvent.emit(tramite);
              this.tramitesService.showModalAbm = false;
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });

  }

  actualizarTramite(): void {

    // Verificacion
    if (this.tramitesService.abmForm.descripcion.trim() === '') return this.alertService.info('La descripción es obligatoria');
    if (this.tramitesService.abmForm.identificador.trim() === '') return this.alertService.info('El identificador es obligatorio');
    if (this.tramitesService.abmForm.iconoUrl.trim() === '') return this.alertService.info('Debe seleccionar un icono');

    this.alertService.question({ msg: 'Actualizando trámite', buttonText: 'Aceptar' })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.alertService.loading();
          const data = {
            ...this.tramitesService.abmForm,
            creatorUserId: this.authService.usuario.userId,
          }

          this.tramitesService.actualizarTramite(this.tramitesService.tramiteSeleccionado.id, data).subscribe({
            next: ({ tramite }) => {
              this.updateEvent.emit(tramite);
              this.tramitesService.showModalAbm = false;
            }, error: ({ error }) => this.alertService.errorApi(error.message)
          })
        }
      });

  }

  cerrarModal(): void {
    this.tramitesService.showModalAbm = false;
  }

  seleccionarDeseleccionarIcono(icono: any): void {
    this.tramitesService.abmForm.iconoUrl = icono.url;
  }

  submit(): void {
    this.tramitesService.estadoAbm === 'crear' ? this.nuevoTramite() : this.actualizarTramite();
  }


}
