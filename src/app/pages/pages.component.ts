import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Comentario } from '../interfaces/comentarios.interface';
import { Disponibilidad } from '../interfaces/disponibilidad.interface';
import { Frace } from '../interfaces/frace.interface';
import { Intencion } from '../interfaces/intencion.interface';
import { Listar } from '../interfaces/listar.interface';
import { Rol } from '../interfaces/rol.interface';
import { Solicitud } from '../interfaces/solicitud.interface';
import { Usuario } from '../interfaces/usuario.interface';
import { AuthenticationService } from '../services/authentication.service';
import { ChatService } from '../services/chat.service';
import { ConfiguracionService } from '../services/configuracion.service';
import { FraceService } from '../services/frace.service';
import { IntencionService } from '../services/intencion.service';
import { RolService } from '../services/rol.service';
import { UsuarioService } from '../services/usuario.service';
import { SetBotPortal } from '../store/Account/account.actions';
import {
  SetComentarios,
  SetInteracciones,
  SetSessiones,
} from '../store/Chat/chat.actions';
import { SetConfiguracionList } from '../store/Configuracion/configuracion.actions';
import { SetFracesList } from '../store/Fraces/fraces.actions';
import { SetIntencionesList } from '../store/Intenciones/intenciones.actions';
import { SetRolesList } from '../store/Roles/roles.actions';
import { SetUsuariosList } from '../store/Usuarios/usuarios.actions';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [],
})
export class PagesComponent implements OnInit {
  listar: Listar = {
    columna: '',
    search: '',
    offset: 0,
    limit: '0',
    sort: '',
  };
  bot?: Usuario;

  constructor(
    private store: Store,
    private rolService: RolService,
    private chatService: ChatService,
    private usuarioService: UsuarioService,
    private authservices: AuthenticationService,
    private intencionService: IntencionService,
    private fraceaService: FraceService,
    private configServices: ConfiguracionService,
    private router: Router
  ) {}

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: Event) {
    event.preventDefault();
    return false;
  }

  ngOnInit(): void {
    this.fetchData();
    if (!this.authservices?.usuario?.verificado) {
      this.router.navigate(['/login']);
    }
  }

  fetchData() {
    this.fetchRoles();
    this.fetchUsers();
    this.fetchSessiones();
    this.fetchSolicitudes();
    this.fetchIntenciones();
    this.fetchFraces();
    this.fetchConfiguracion();
    this.fetchComentarios();
  }

  fetchRoles() {
    this.rolService.obtenerRoles(this.listar).subscribe((roles: Rol[]) => {
      this.store.dispatch(new SetRolesList(roles));
    });
  }
  fetchUsers() {
    this.usuarioService
      .obtenerUsuarios(undefined, this.listar)
      .subscribe((usuarios: Usuario[]) => {
        const bot = usuarios.find((user) => user?.rol?.toLowerCase() === 'bot');
        if (bot) {
          this.bot = bot;
          this.store.dispatch(new SetBotPortal(bot));
        }

        this.store.dispatch(new SetUsuariosList(usuarios));
      });
  }

  fetchIntenciones() {
    this.intencionService
      .obtenerIntenciones(this.listar)
      .subscribe((intenciones: Intencion[]) => {
        this.store.dispatch(new SetIntencionesList(intenciones));
      });
  }
  fetchFraces() {
    this.fraceaService
      .obtenerFraces(this.listar)
      .subscribe((fraces: Frace[]) => {
        this.store.dispatch(new SetFracesList(fraces));
      });
  }
  fetchConfiguracion() {
    this.configServices
      .obtenerDisponibilidades(this.listar)
      .subscribe((disponibilidad: Disponibilidad[]) => {
        this.store.dispatch(new SetConfiguracionList(disponibilidad));
      });
  }
  fetchChatActual() {}
  fetchSolicitudes() {
    this.chatService
      .getSolicitudes(new Date().getFullYear().toString(), '', this.listar)
      .subscribe((solicitudes: Solicitud[]) => {
        this.store.dispatch(
          new SetInteracciones({
            list: solicitudes,
            bot: this.bot,
          })
        );
      });
  }
  fetchComentarios() {
    this.chatService
      .getComentarios(this.listar)
      .subscribe((comentarios: Comentario[]) => {
        this.store.dispatch(new SetComentarios(comentarios));
      });
  }
  fetchSessiones() {
    this.chatService.getSessiones('', this.listar).subscribe((resp) => {
      this.store.dispatch(new SetSessiones(resp));
    });
  }
}
