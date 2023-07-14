import { Injectable } from '@angular/core';
import { Modulo } from '../interfaces/modulo.intrface';
import { Rol } from '../interfaces/rol.interface';
import { RolService } from './rol.service';

@Injectable({
  providedIn: 'root',
})
export class ModulosService {
  constructor() {}

  private modulos: Modulo[] = [
    {
      rol: ['Administrador', 'Agente'],
      nombre: 'Inicio',
      ruta: '/dashboard',
      icon: 'uil-home-alt',
      submenu: [],
    },
    {
      rol: ['Administrador', 'Agente'],
      nombre: 'Chat',
      ruta: '/dashboard/chat',
      icon: 'uil-comments-alt',
      submenu: [],
    },
    {
      rol: ['Agente', 'Administrador'],
      nombre: 'Usuarios',
      ruta: '/dashboard/usuarios',
      icon: 'uil-user-square',
      submenu: [],
    },
    {
      rol: ['Administrador'],
      nombre: 'Cuentas',
      ruta: '',
      icon: 'uil-users-alt',
      submenu: [
        {
          rol: ['Administrador'],
          nombre: 'Administradores',
          ruta: 'Administrador',
          icon: '',
          submenu: [],
        },
        {
          rol: ['Administrador'],
          nombre: 'Agentes',
          ruta: 'Agente',
          icon: '',
          submenu: [],
        },
        {
          rol: ['Administrador'],
          nombre: 'Bots',
          ruta: 'Bot',
          icon: '',
          submenu: [],
        },
      ],
    },
    {
      rol: ['Administrador'],
      nombre: 'Roles',
      ruta: '/dashboard/roles',
      icon: 'uil-lock-access',
      submenu: [],
    },

    {
      rol: ['Administrador'],
      nombre: 'Intenciones',
      ruta: '/dashboard/intenciones',
      icon: 'uil-right-indent-alt',
      submenu: [],
    },
    {
      rol: ['Administrador'],
      nombre: 'Frases',
      ruta: '/dashboard/frases',
      icon: 'uil-align-center-justify',
      submenu: [],
    },
    {
      rol: ['Administrador', 'Agente'],
      nombre: 'Configuración',
      ruta: '/dashboard/configuracion',
      icon: 'uil-cog',
      submenu: [],
    },
  ];

  getModulos(rol: string): Modulo[] {
    this.modulos = this.modulos.filter((modulo) => modulo.rol.includes(rol));
    return this.modulos;
  }
}
