import { Component, OnInit } from '@angular/core';
import { Listar } from 'src/app/interfaces/listar.interface';
import { Rol } from 'src/app/interfaces/rol.interface';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RolService } from 'src/app/services/rol.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as signalR from "@microsoft/signalr"

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {
  cargando = false;
  roles: Rol[] = [];
  nombreUsuario: string = '';
  rol: string = '';
  private _hubConnection: signalR.HubConnection | undefined
  usuariosOnline: Usuario[] = [];


  constructor(
    private usuarioService: UsuarioService,
    private authservices: AuthenticationService,
    private rolService: RolService,
  ) {
    if (authservices.usuario != null) {
      this.nombreUsuario = this.authservices.usuario.nombres + ' ' + this.authservices.usuario.apellidos;
      let user = this.nombreUsuario.split(' ');
      if (user.length > 2) {
        this.nombreUsuario = user[0] + ' ' + user[2];
      }
      this.getRol(this.authservices.usuario.rol);
    }

    this.cargando = true;
  }

  ngOnInit(): void {
    this.starConnection();
    this.getConectados(2);
    this._hubConnection?.on('ContadorSession', (resp) => {
      console.log('Holas');
      
      const audio = new Audio('assets/tonos/nuevo_usuario.mp3');
      if (resp == "enter" && this.roles.find(r => r.id == this.authservices.usuario.rol)?.nombre == "Administrador") {
        audio.play();
      }
      this.getConectados(2);
    });
  }
  refrescar(){
    this.getConectados(3);
  }

  logout() {
    this.authservices.cerrarSesion();
  }

  getRol(idRol: string) {
    const listar: Listar = {
      columna: "",
      search: "",
      offset: 0,
      limit: 100,
      sort: ""
    }
    this.rolService.obtenerRoles(listar).subscribe((resp) => {
      this.roles = resp;
      this.rol = this.roles.find(r => r.id == idRol ? r.nombre : '')?.nombre ?? '';
      this.cargando = false;
    });
  }

  getConectados(rol: number) {
    this.usuarioService.usuarioEnLinea(rol).subscribe(resp => {
      this.usuariosOnline = resp;
    });
  }
  starConnection() {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://bibliochatservice02.azurewebsites.net/prueba',
        {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        }
      ).build();
    this._hubConnection.start()
      .then(() =>
        console.log('connection start'))
      .catch(err => {
        console.log('Error while establishing the connection')
      });
  }

}
