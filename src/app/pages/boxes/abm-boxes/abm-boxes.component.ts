import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '../../../components/modal/modal.component';
import { FechaPipe } from '../../../pipes/fecha.pipe';
import { AlertService } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { BoxesService } from '../../../services/boxes.service';

@Component({
  selector: 'app-abm-boxes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FechaPipe,
    ModalComponent,
    RouterModule,
  ],
  templateUrl: './abm-boxes.component.html',
})
export default class AbmBoxesComponent {

  @Output()
  public insertEvent = new EventEmitter<any>();

  @Output()
  public updateEvent = new EventEmitter<any>();

  public abmForm = {
    descripcion: '',
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    this.boxesService.showModalAbm = false;
  }

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    public boxesService: BoxesService,
  ) { }

  ngOnInit() {}

  nuevoBox(): void {

    // Verificacion
    if (this.boxesService.abmForm.descripcion.trim() === '') return this.alertService.info('La descripción es obligatoria');

    this.alertService.question({ msg: 'Creando nuevo box', buttonText: 'Aceptar' })
    .then(({ isConfirmed }) => {
      if (isConfirmed) {
        this.alertService.loading();
        const data = {
          ...this.boxesService.abmForm,
          creatorUserId: this.authService.usuario.userId,
        }
        this.boxesService.nuevoBox(data).subscribe({
          next: ({ box }) => {
            this.insertEvent.emit(box);
            this.boxesService.showModalAbm = false;
            this.reiniciarForm();
          }, error: ({ error }) => this.alertService.errorApi(error.message)
        })
      }
    });

  }

  actualizarBox(): void {

    // Verificacion
    if (this.boxesService.abmForm.descripcion.trim() === '') return this.alertService.info('La descripción es obligatoria');

    this.alertService.question({ msg: 'Actualizando box', buttonText: 'Aceptar' })
    .then(({ isConfirmed }) => {
      if (isConfirmed) {
        this.alertService.loading();
        const data = {
          ...this.boxesService.abmForm,
          creatorUserId: this.authService.usuario.userId,
        }

        this.boxesService.actualizarBox(this.boxesService.boxSeleccionado.id, data).subscribe({
          next: ({ box }) => {
            this.updateEvent.emit(box);
            this.boxesService.showModalAbm = false;
          }, error: ({ error }) => this.alertService.errorApi(error.message)
        })
      }
    });

  }

  cerrarModal(): void {
    this.boxesService.showModalAbm = false;
  }

  reiniciarForm(): void {
    this.abmForm = {
      descripcion: '',
    }
  }

  submit(): void {
    this.boxesService.estadoAbm === 'crear' ? this.nuevoBox() : this.actualizarBox();
  }


}
