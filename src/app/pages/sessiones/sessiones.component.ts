import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Listar } from 'src/app/interfaces/listar.interface';
import { MensageModel } from 'src/app/interfaces/mensaje.interface';
import { Session } from 'src/app/interfaces/session.interface';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { ChatService } from 'src/app/services/chat.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sessiones',
  templateUrl: './sessiones.component.html',
  styleUrls: ['./sessiones.component.css'],
})
export class SessionesComponent implements OnInit {
  usuario!: Usuario;
  sessiones: Session[] = [];
  messages: MensageModel[] = [];
  cargando: boolean = false;
  cargandoMensajes: boolean = false;
  @ViewChild('scrollMessages') private scrollMessages!: ElementRef;
  @ViewChild('scrollChat') private scrollChat!: ElementRef;
  @ViewChild('txtmessage') private txtMessage!: ElementRef;

  @HostListener('scroll', ['$event'])
  doSomethingOnScroll($event: Event) {
    let scrollOffset = ($event.target as Element).scrollTop;
    console.log('scroll: ', scrollOffset);
  }
  constructor(
    private router: ActivatedRoute,
    private chatService: ChatService,
    private _location: Location,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
  }
  backClicked() {
    this._location.back();
  }

  getUser(usuario: Usuario) {
    this.usuario = usuario;
  }
  getSessiones(id: string) {

  }
  cragarChat(idSession: string) {
    this.cargandoMensajes = true;
    this.chatService.getChat(idSession).subscribe((resp) => {
      this.messages = resp;
      console.log(this.messages);
      this.cargandoMensajes = false;
    });
  }
}
