import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
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
  nombreUsuario: string = '';
  rol: string = '';
  private _hubConnection: signalR.HubConnection | undefined
  usuariosOnline: Usuario[] = [];


  constructor(
    private usuarioService: UsuarioService,
    private authservices: AuthenticationService,
  ) {
    if (authservices.usuario != null) {
      this.nombreUsuario = this.authservices.usuario.nombre_completo!;
      this.rol=this.authservices.usuario.rol!;
    }

    this.cargando = true;
  }

  ngOnInit(): void {
    this.starConnection();
    this.getConectados(2);
    this._hubConnection?.on('ContadorSession', (resp) => {
      const audio = new Audio('assets/tonos/nuevo_usuario.mp3');
      if (resp == "enter" && this.authservices.usuario.rol== "Administrador") {
        audio.play();
      }
      this.getConectados(2);
    });
  }
  refrescar(){
    this.getConectados(2);
  }

  logout() {
    this.authservices.cerrarSesion();
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
