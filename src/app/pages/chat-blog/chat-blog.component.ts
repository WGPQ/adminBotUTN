import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BotService } from 'src/app/services/bot.service';
import { FormsService } from 'src/app/services/forms.service';
import html2canvas from 'html2canvas';
import { SendChat } from 'src/app/interfaces/sendchat.interface';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { ChatService } from 'src/app/services/chat.service';
import { Store } from '@ngxs/store';
import { SetAccountState } from 'src/app/store/Account/account.state';
import { RemoveAccountBlog } from 'src/app/store/Account/account.actions';
import { HelpersService } from 'src/app/services/helpers.service';
import { Rol } from 'src/app/interfaces/rol.interface';
import { RolService } from 'src/app/services/rol.service';
import { Listar } from 'src/app/interfaces/listar.interface';
import { ClienteService } from 'src/app/services/cliente.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SetUsuarioChat } from 'src/app/store/Chat/chat.actions';

@Component({
  selector: 'app-chat-blog',
  templateUrl: './chat-blog.component.html',
  styleUrls: ['./chat-blog.component.css'],
})
export class ChatBlogComponent implements OnInit {
  @ViewChild('scrollMessages') private scrollMessages!: ElementRef;
  @ViewChild('scrollChat') private scrollChat!: ElementRef;
  @ViewChild('txtmessage') private txtMessage!: ElementRef;
  chatForm!: FormGroup;
  comentarioForm!: FormGroup;
  conversationId: any = null;
  activities: any[] = [];
  roles: Rol[] = [];
  usuario?: Usuario;
  mensageForm!: FormGroup;
  loading: boolean = false;
  showError: boolean = false;
  messageError: String = '';
  showInputName: boolean = false;
  showComentario: boolean = false;
  emogiSelect?: number;
  session?: string;
  token?: string;
  usuarioChat?: Usuario;
  botName: string = 'BiblioChat UTN';
  correo?: string;

  @HostListener('scroll', ['$event'])
  doSomethingOnScroll($event: Event) {
    let scrollOffset = ($event.target as Element).scrollTop;
    console.log('scroll: ', scrollOffset);
  }
  constructor(
    private store: Store,
    private formService: FormsService,
    private botService: BotService,
    private clienteService: ClienteService,
    private chatService: ChatService,
    private usuarioService: UsuarioService,
    private authservices: AuthenticationService,
    private helperService: HelpersService
  ) {
    this.chatForm = formService.crearFormularioChatBlog(this.showInputName);
    this.mensageForm = formService.crearFormularioMensaje();
    this.comentarioForm = formService.crearFormularioComentario();
    botService.initBotConfigBlog();
    console.log(this.conversationId);
  }
  colors: any[] = [
    '#FF6F18',
    '#EB7181', // red
    '#468547', // green
    '#FFD558', // yellow
    '#3670B2', // blue
  ];
  randomIndex: number = Math.floor(
    Math.random() * Math.floor(this.colors.length)
  );
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollChat.nativeElement.scrollTop =
        this.scrollChat.nativeElement.scrollHeight;
      this.scrollMessages.nativeElement.scrollToBottom =
        this.scrollMessages.nativeElement.scrollHeight;
    } catch (err) {}
  }
  ngOnInit(): void {
    this.scrollToBottom();
    this.listeMessages();
    this.conversationId = sessionStorage.getItem('conversationIdBlog');
    this.token = sessionStorage.getItem('access-token-blog')!;
    const idUser = sessionStorage.getItem('id_userChat');
    this.verificarSession();
    if (idUser && this.token) {
      this.fetchUserChat(idUser, this.token);
    }
  }
  get correoNoValido() {
    return (
      this.chatForm.get('correo')?.invalid &&
      this.chatForm.get('correo')?.touched
    );
  }
  get nombreNoValido() {
    return (
      this.chatForm.get('nombre')?.invalid &&
      this.chatForm.get('nombre')?.touched
    );
  }

  get comentarioNoValido() {
    return (
      this.comentarioForm.get('comentario')?.invalid &&
      this.comentarioForm.get('comentario')?.touched
    );
  }

  nuevaConversacion() {
    sessionStorage.clear();
    this.usuario = undefined;
    this.usuarioChat = undefined;
    this.token = undefined;
    this.session = undefined;
    this.showComentario = false;
    this.correo = undefined;
  }

  calificacion(score: number) {
    this.emogiSelect = score;
    this.chatService
      .calificarChat(this.session!, score, this.token!)
      .subscribe(() => {});
  }
  initialsName(name: string) {
    return this.helperService.initialLettersName(name);
  }
  iniciar() {
    if (this.chatForm.invalid) {
      return Object.values(this.chatForm.controls).forEach((contr) => {
        if (contr instanceof FormGroup) {
          Object.values(contr.controls).forEach((contr) =>
            contr.markAllAsTouched()
          );
        } else {
          contr.markAsTouched();
        }
      });
    }
    const correo = this.chatForm.value.correo;
    if (this.showInputName) {
      this.loading = true;
      const cliente: Cliente = {
        nombres: this.chatForm.value.nombre,
        activo: true,
        apellidos: '',
        correo: this.chatForm.value.correo,
        id_rol: 'wPtVI3NH3K_9J94isfTpXQ',
      };
      this.clienteService.ingresarClienteByBlog(cliente).subscribe((resp) => {
        if (resp.exito) {
          this.loading = true;

          this.loginCliente(cliente?.correo);
        } else {
          this.showError = true;
          this.loading = false;
          this.messageError =
            'Error al intentar crear una cuenta, vuelva a intentarlo';
        }
      });
    } else {
      this.loading = true;
      this.loginCliente(correo);
    }
  }

  loginCliente(correo: string) {
    this.correo = correo;
    this.authservices.acceso_chat_blog(correo).subscribe(
      (resp) => {
        if (resp) {
          this.authservices?.verificarTokenBlog().subscribe(
            (authenticate) => {
              if (authenticate) {
                this.usuario = this.authservices?.usuario;
                this.session = sessionStorage.getItem('session-blog')!;
                this.token = sessionStorage.getItem('access-token-blog')!;
                this.botService
                  .sendMessageBlog(correo, this.usuario!, '')
                  .subscribe(
                    (resp) => {
                      if (resp) {
                        if (!sessionStorage.conversationIdBlog) {
                          sessionStorage.conversationIdBlog =
                            resp.split('|')[0];
                          this.conversationId = resp.split('|')[0];
                        }
                      }
                      this.loading = false;
                    },
                    (error) => {
                      this.showError = true;
                      this.loading = false;
                      this.messageError =
                        'Error al intentar conectarse al chat';
                    }
                  );
              } else {
                this.showError = true;
                this.loading = false;
                this.messageError =
                  'Ocurrio un error inesperado, intentelo de nuevo por favor.';
              }
            },
            (error) => {
              this.showError = true;
              this.loading = false;
              this.messageError =
                'Ocurrio un error al verificar sus credenciales, intentelo de nuevo por favor.';
            }
          );
        } else {
          this.showInputName = true;
          this.loading = false;
          this.chatForm = this.formService.crearFormularioChatBlog(
            this.showInputName
          );
          this.chatForm.patchValue({
            correo: correo,
          });
        }
      },
      (error) => {
        this.showError = true;
        this.loading = false;
        this.messageError =
          'Ocurrio un error inesperado, intentelo de nuevo por favor.';
      }
    );
  }

  verificarSession() {
    if (this.authservices?.estaAutenticadoBlog()) {
      this.authservices?.verificarTokenBlog().subscribe((authenticate) => {
        if (authenticate) {
          this.usuario = this.authservices?.usuario;
          this.correo = this.usuario?.correo!;
          this.getSession(
            this.usuario?.id!,
            sessionStorage.getItem('access-token-blog')!
          );
        }
      });
    }
  }
  getSession(id: string, token: string) {
    this.authservices.getSession(id, token).subscribe((resp: any) => {
      if (resp.exito) {
        this.session = resp.id;
      }
    });
  }
  localDate(date: any) {
    let utcDate = new Date(date);
    return new Date(utcDate.getTime() + utcDate.getTimezoneOffset());
  }
  imagen() {
    console.log('adjuntar');
  }

  listeMessages() {
    try {
      this.botService.directLineBlog!.activity$.subscribe((activity: any) => {
        if (
          !this.activities.includes(activity) &&
          activity.text !== '@exit_connection' &&
          !activity.text.includes('@connected with')
        ) {
          let actv = { ...activity };
          if (
            this.usuarioChat != null &&
            activity?.from?.id != this.usuario?.id
          ) {
            actv = {
              ...actv,
              from: {
                id: this.usuarioChat?.id,
                name: this.usuarioChat?.nombre_completo,
              },
            };
            actv.text = actv?.text.replace(
              `${this.usuarioChat.nombre_completo}:`,
              ''
            );
          }
          this.activities = [...this.activities, actv];
        }
        if (activity.text.includes('@connected with:')) {
          let userId = activity.text.split(':')[1];
          this.fetchUserChat(userId, this.token!);
        }

        if (
          activity.text === '@exit_connection' &&
          this.conversationId != null
        ) {
          this.mensageForm.get('message')!.disable();
          setTimeout(() => {
            this.conversationId = null;
            this.showComentario = true;
            this.token = sessionStorage.getItem('access-token-blog')!;
            this.getSession(this.usuario?.id!, this.token);
            this.enviarChat(this.token);
            this.authservices.cerrarSesionBlog();
          }, 2000);
        }
      });
    } catch (error) {
      console.log('listeMessages', error);
    }
  }

  fetchUserChat(userId: string, token: string) {
    this.usuarioService
      .obtenerUsuario(userId, token)
      .subscribe((user: Usuario) => {
        if (user) {
          this.usuarioChat = user;
          sessionStorage.setItem('id_userChat', user?.id!);
          this.store.dispatch(new SetUsuarioChat(user));
        }
      });
  }

  sendMessage() {
    if (
      this.mensageForm.valid &&
      this.mensageForm.value.message.trim().length > 0
    ) {
      const message = this.mensageForm.value.message.trim();
      try {
        this.botService
          .sendMessageBlog(message, this.usuario!, '')
          .subscribe((resp) => {
            if (!sessionStorage.conversationIdBlog) {
              sessionStorage.conversationIdBlog = resp.split('|')[0];
              this.conversationId = resp.split('|')[0];
            }
          });
        this.mensageForm.disable();
        this.mensageForm.reset();
        this.mensageForm.enable();
        this.txtMessage.nativeElement.focus();
      } catch (error) {
        console.log('sendMessage', error);
      }
    }
  }

  salirChat() {
    this.botService
      .sendMessageBlog('@ Disconnect', this.usuario!, null)
      .subscribe((resp) => {
        this.showComentario = true;
        this.conversationId = null;
        this.token = sessionStorage.getItem('access-token-blog')!;
        this.getSession(this.usuario?.id!, this.token);
        this.enviarChat(this.token);
        this.authservices.cerrarSesionBlog();
      });
  }

  enviarComentario() {
    try {
      if (this.comentarioForm.invalid) {
        return Object.values(this.comentarioForm.controls).forEach((contr) => {
          if (contr instanceof FormGroup) {
            Object.values(contr.controls).forEach((contr) =>
              contr.markAllAsTouched()
            );
          } else {
            contr.markAsTouched();
          }
        });
      }
      const comentarioData = {
        contenido: this.comentarioForm.value.comentario,
        session: this.session,
        correo: this.correo,
      };
      if (this.token) {
        this.chatService
          .senComentario(comentarioData, this.token!)
          .subscribe((resp) => {
            if (resp.exito) {
            }
          });
        this.showComentario = false;
        this.token = '';
        this.comentarioForm.reset();
        this.chatForm.reset();
      }
    } catch (error) {}
  }

  enviarChat(token: string) {
    html2canvas(document.querySelector('#chat-messages')!).then((canvas) => {
      const user: Cliente = { ...this.usuario! };
      const data: SendChat = {
        image: canvas.toDataURL(),
        comentario: '',
        usuario: user,
      };
      this.chatService.sendChat(data, token).subscribe(
        (resp) => {
          this.store.dispatch(new RemoveAccountBlog(null));
          this.activities = [];
        },
        (error) => {}
      );
    });
  }
}
