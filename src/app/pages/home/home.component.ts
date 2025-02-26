import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import gsap from 'gsap';
import { ModalComponent } from '../../components/modal/modal.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    CommonModule,
    ModalComponent,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: []
})
export default class HomeComponent implements OnInit {

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
    gsap.from('.gsap-contenido', { y:100, opacity: 0, duration: .2 });
  }

}
