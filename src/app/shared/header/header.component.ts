import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as signalR from '@microsoft/signalr';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SetAccountState } from 'src/app/store/Account/account.state';
import { HelpersService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cargando = false;
  usuario!: Usuario;
  private _hubConnection: signalR.HubConnection | undefined;
  usuariosOnline: Usuario[] = [];
  mostrarUsuariosEnLinea: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private helperService: HelpersService,
    private authservices: AuthenticationService,
    private store: Store
  ) {
    if (authservices.usuario != null) {
      this.store.select(SetAccountState.getAccount).subscribe((user) => {
        this.usuario = user!;
      });
      this.mostrarUsuariosEnLinea = this.usuario.rol === 'Administrador';
    }
    this.cargando = true;
  }

  ngOnInit(): void {
    this.starConnection();
    this.getConectados(2);
    this._hubConnection?.on('ContadorSession', (resp) => {
      const audio = new Audio('assets/tonos/nuevo_usuario.mp3');
      if (resp == 'enter' && this.authservices.usuario.rol == 'Administrador') {
        audio.play();
      }
      this.getConectados(2);
    });
  }
  refrescar() {
    this.getConectados(2);
  }

  initialsName(name: string) {
    return this.helperService.initialLettersName(name);
  }

  logout() {
    this.authservices.cerrarSesion();
  }

  getConectados(rol: number) {
    this.usuarioService.usuarioEnLinea(rol).subscribe((resp) => {
      this.usuariosOnline = resp;
    });
  }
  starConnection() {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://bibliochatservice02.azurewebsites.net/prueba', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();
    this._hubConnection
      .start()
      .then(() => console.log('connection start'))
      .catch((err) => {
        console.log('Error while establishing the connection');
      });
  }
}
