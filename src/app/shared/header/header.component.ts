import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as signalR from '@microsoft/signalr';
import { Store } from '@ngxs/store';
import { SetAccountState } from 'src/app/store/Account/account.state';
import { HelpersService } from 'src/app/services/helpers.service';
import { ChatState } from 'src/app/store/Chat/chat.state';
import { UsuariosState } from 'src/app/store/Usuarios/usuarios.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  cargando = false;
  usuario!: Usuario;
  rol: string = 'Agente';
  private _hubConnection: signalR.HubConnection | undefined;
  usuariosOnline: Usuario[] = [];
  solicitudes: any[] = [];
  mostrarUsuariosEnLinea: boolean = false;
  mostrarNotificacionesSolicitudes: boolean = true;

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
      // this.mostrarUsuariosEnLinea = this.usuario.rol === 'Administrador';
    }
    this.cargando = true;
    this.store.select(ChatState.showNotification).subscribe((show) => {
      this.mostrarNotificacionesSolicitudes = show;
    });
  }

  ngOnInit(): void {
    // this.starConnection();
    // this.getConectados();
    this._hubConnection?.on('ContadorSession', (resp) => {
      // const audio = new Audio('assets/tonos/nuevo_usuario.mp3');
      // if (resp == 'enter' && this.authservices.usuario.rol == 'Administrador') {
      //   audio.play();
      // }
      this.getConectados();
    });
    this.getSolicitudes();
  }

  getSolicitudes() {
    this.store.select(ChatState.getSolicitudes).subscribe((requests) => {
      this.solicitudes = requests;
    });
  }
  refrescar() {
    this.getConectados();
  }

  initialsName(name: string) {
    return this.helperService.initialLettersName(name);
  }

  logout() {
    this.authservices?.cerrarSesion();
  }

  getConectados() {
    this.store
      .select(UsuariosState.getUsuariosList)
      .subscribe((usuariosList: Usuario[]) => {
        this.usuariosOnline = usuariosList.filter(
          (usuario) =>
            usuario.rol?.toLowerCase() === this.rol.toLowerCase() &&
            usuario.conectado === true
        );
      });
  }
  starConnection() {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://bibliochat-api.azurewebsites.net/prueba', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();
    this._hubConnection
      .start()
      .then(() => {})
      .catch((err) => {
        console.log('Error while establishing the connection');
      });
  }
}
