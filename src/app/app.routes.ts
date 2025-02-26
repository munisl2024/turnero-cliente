import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

  // Default
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },

  // Login
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./auth/login/login.component'),
  },

  // Inicializacion
  {
    path: 'init',
    title: 'Inicializacion',
    loadComponent: () => import('./inicializacion/inicializacion.component'),
  },

  // Totem
  {
    path: 'totem',
    title: 'Totem',
    loadComponent: () => import('./externos/totem/totem.component'),
  },

  // Pantalla
  {
    path: 'pantalla',
    title: 'Pantalla',
    loadComponent: () => import('./externos/pantalla/pantalla.component'),
  },

  // Dashboard
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/pages.component'),
    canActivate: [AuthGuard],
    children: [

      // Home
      {
        path: 'home',
        title: 'Inicio',
        loadComponent: () => import('./pages/home/home.component'),
      },

      // Perfil
      {
        path: 'perfil',
        title: 'Perfil',
        loadComponent: () => import('./pages/perfil/perfil.component'),
      },

      // Usuarios

      {
        path: 'usuarios',
        title: 'Usuarios',
        loadComponent: () => import('./pages/usuarios/usuarios.component'),
      },

      {
        path: 'usuarios/nuevo',
        title: 'Nuevo usuario',
        loadComponent: () => import('./pages/usuarios/nuevo-usuario/nuevo-usuario.component'),
      },

      {
        path: 'usuarios/editar/:id',
        title: 'Editar usuario',
        loadComponent: () => import('./pages/usuarios/editar-usuario/editar-usuario.component'),
      },

      {
        path: 'usuarios/password/:id',
        title: 'Editar password',
        loadComponent: () => import('./pages/usuarios/editar-password/editar-password.component'),
      },

      // Boxes
      {
        path: 'boxes',
        title: 'Boxes',
        loadComponent: () => import('./pages/boxes/boxes.component'),
      },

      // Tramites
      {
        path: 'tramites',
        title: 'Tramites',
        loadComponent: () => import('./pages/tramites/tramites.component'),
      },

      // Asignaciones
      {
        path: 'asignaciones/:id',
        title: 'Asignaciones',
        loadComponent: () => import('./pages/usuarios/asignaciones/asignaciones.component'),
      },

      // Atender
      {
        path: 'atender',
        title: 'Atender',
        loadComponent: () => import('./pages/atender/atender.component'),
      },

      // Reiniciar
      {
        path: 'reiniciar',
        title: 'Reiniciar',
        loadComponent: () => import('./pages/reiniciar/reiniciar.component'),
      },

      // Estadisticas
      {
        path: 'estadisticas',
        title: 'Estadisticas',
        loadComponent: () => import('./pages/estadisticas/estadisticas.component'),
      },

    ]
  },

  // Error Page
  {
    path: '**',
    title: 'Error',
    loadComponent: () => import('./error-page/error-page.component'),
  },

];
