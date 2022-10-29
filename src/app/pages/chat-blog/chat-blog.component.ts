import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BibliotecaService } from 'src/app/services/biblioteca.service';
import { BotService } from 'src/app/services/bot.service';
import { FormsService } from 'src/app/services/forms.service';

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
  chatId: any = null;
  activities: any[] = [];
  usuario?: Usuario;
  mensageForm!: FormGroup;
  loading:boolean=false;

  @HostListener('scroll', ['$event'])
  doSomethingOnScroll($event: Event) {
    let scrollOffset = ($event.target as Element).scrollTop;
    console.log('scroll: ', scrollOffset);
  }
  constructor(
    private formService: FormsService,
    private botService: BotService,
    private authservices: AuthenticationService,
  ) {
    this.chatForm = formService.crearFormularioChatBlog();
    this.mensageForm = formService.crearFormularioMensaje();
    if (localStorage.getItem('chat-id')) {
      this.chatId = localStorage.getItem('chat-id');
    }
  }
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
    this.chatId = localStorage.getItem("chat-id");
  }
  get correoNoValido() {
    return (
      this.chatForm.get('correo')?.invalid &&
      this.chatForm.get('correo')?.touched
    );
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
this.loading=true;
    const correo = this.chatForm.value.correo;
    this.authservices.acceso_chat_blog(correo).subscribe(resp => {
      if(resp){
        this.authservices.verificarToken().subscribe(authenticate=>{
          if(authenticate){
            this.mensageForm.patchValue({
              message: correo,
            });
            this.sendMessage();
            localStorage.setItem("chat-id",correo);
            this.chatId = correo ;
            this.usuario = this.authservices.usuario;
            this.loading=false;
          }

        });
      }

    });
  }
  listeMessages() {
    try {
      this.botService.directLine!.activity$.subscribe((activity: any) => {
        if (!this.activities.includes(activity)) {
          this.activities = [...this.activities, activity];
        }
        console.log("Hola",activity);

      });
    } catch (error) {
      console.log('listeMessages', error);
    }
  }
  salir(){
    this.chatId=null;
    localStorage.removeItem("chat-id");
  }
  sendMessage() {
    if (
      this.mensageForm.valid &&
      this.mensageForm.value.message.trim().length > 0
    ) {
      const message = this.mensageForm.value.message.trim();
      try {
        this.botService.sendMessage(message).subscribe((resp) => {
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
}
