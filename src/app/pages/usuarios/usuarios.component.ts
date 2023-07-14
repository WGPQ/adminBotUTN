import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { Listar } from 'src/app/interfaces/listar.interface';
import { MensageModel } from 'src/app/interfaces/mensaje.interface';
import { Session } from 'src/app/interfaces/session.interface';
import { AlertService } from 'src/app/services/alert.service';
import { ChatService } from 'src/app/services/chat.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { FormsService } from 'src/app/services/forms.service';
import { RolService } from 'src/app/services/rol.service';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import { SendChat } from 'src/app/interfaces/sendchat.interface';
import { HelpersService } from 'src/app/services/helpers.service';
import { UsuariosState } from 'src/app/store/Usuarios/usuarios.state';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { Store } from '@ngxs/store';
import { RolesState } from 'src/app/store/Roles/roles.state';
import { Rol } from 'src/app/interfaces/rol.interface';
import {
  RemoveUsuario,
  SetUsuario,
} from 'src/app/store/Usuarios/usuarios.actions';

@Component({
  selector: 'app-clientes',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  clientes: Cliente[] = [];
  clienteForm!: FormGroup;
  liatarForm!: FormGroup;
  submitType: string = 'Guardar';
  action = 'Agregar';
  idCliente?: string;
  cliente!: Cliente;
  cargando = true;
  position: number = 0;
  rol: string = 'Usuario';
  idRol!: string;
  showChats: boolean = false;
  usuario!: Cliente;
  sessiones: Session[] = [];
  messages: MensageModel[] = [];
  cargandoMensajes: boolean = false;
  fecha_chat_seleccionado?: Date;
  pagina = 0;
  paginaActiva = 0;
  numeroPaginas = new Array(1);
  previus = false;
  next = true;
  setTimeRef: any;
  orderAsc: boolean = true;

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
  @ViewChild('scrollMessages') private scrollMessages!: ElementRef;
  @ViewChild('scrollChat') private scrollChat!: ElementRef;
  @ViewChild('txtmessage') private txtMessage!: ElementRef;

  @HostListener('scroll', ['$event'])
  doSomethingOnScroll($event: Event) {
    let scrollOffset = ($event.target as Element).scrollTop;
  }
  @ViewChild('closebutton') closebutton: any;
  constructor(
    private store: Store,
    private clienteService: ClienteService,
    private alertService: AlertService,
    private formService: FormsService,
    private chatService: ChatService,
    private helperService: HelpersService
  ) {
    this.clienteForm = formService.crearFormularioCliente();
    this.liatarForm = formService.crearFormularioListar();
  }

  ngOnInit(): void {
    this.fetchClients();
    this.fetchRol();
  }
  ngOnDestroy(): void {
    clearTimeout(this.setTimeRef);
  }
  limitar() {
    this.listarClientes();
  }

  initialsName(name: string) {
    return this.helperService.initialLettersName(name);
  }

  previusPage() {
    if (this.pagina > 0) {
      this.pagina -= 10;
      this.paginaActiva -= 1;
    }
    if (this.pagina == 0) {
      this.previus = false;
      this.next = true;
    }
  }
  irPagina(nPagina: number) {
    this.previus = nPagina > 0 ? true : false;
    this.pagina = nPagina * 10;
    this.next = this.pagina + 10 < this.clientes.length ? true : false;
    this.paginaActiva = nPagina;
  }
  nextPage() {
    if (this.clientes.length > this.pagina) {
      this.pagina += 10;
      this.paginaActiva += 1;
      this.previus = true;
      this.next = this.pagina + 10 < this.clientes.length ? true : false;
    }
  }

  agregarRol() {
    this.clienteForm.reset();
    this.action = 'Agregar';
    this.submitType = 'Guardar';
  }
  onFilterDate(event: any) {
    var date = event.target?.value;
    if (this.clientes.length == 0) {
      this.fetchClients();
    }
    if (date) {
      // Your UTC date
      const utcDate = new Date(date);

      // Convert UTC to local time
      const localDate = new Date(
        utcDate.getTime() + utcDate.getTimezoneOffset() * 60 * 1000
      );
      var currentDate = new Date(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate()
      );

      this.clientes = [
        ...this.clientes.filter((c) => {
          var day = new Date(c?.conectedAt!);
          var conectedDay = new Date(
            day.getFullYear(),
            day.getMonth(),
            day.getDate()
          );
          return +conectedDay == +currentDate;
        }),
      ];
    } else {
      this.fetchClients();
    }
  }
  getEmogi(calificacion?: number) {
    if (calificacion == 0) return `🙁`;
    if (calificacion == 1) return `😐 `;
    if (calificacion == 2) return `🙂`;
    return `😶`;
  }
  onChangeSort() {
    this.orderAsc = !this.orderAsc;

    if (this.orderAsc) {
      this.clientes = [
        ...this.clientes.sort((a, b) =>
          a.conectedAt! < b?.conectedAt! ? 1 : -1
        ),
      ];
    } else {
      this.clientes = [
        ...this.clientes.sort((a, b) =>
          a.conectedAt! > b?.conectedAt! ? 1 : -1
        ),
      ];
    }
  }

  fetchClients() {
    this.store
      .select(UsuariosState.getUsuariosList)
      .subscribe((usuariosList: Usuario[]) => {
        this.clientes = usuariosList.filter(
          (usuario) => usuario.rol?.toLowerCase() === this.rol.toLowerCase()
        );
        this.clientes.sort((a, b) => (a.conectedAt! < b?.conectedAt! ? 1 : -1));
        this.setTimeRef = setTimeout(() => (this.cargando = false), 500);
      });
  }

  fetchRol() {
    this.store.select(RolesState.getRolesList).subscribe((rolesList: Rol[]) => {
      let rol = rolesList.find(
        (rol: Rol) => rol.nombre?.toLowerCase() === this.rol.toLowerCase()
      );
      this.idRol = rol?.id!;
    });
  }

  get nombresNoValido() {
    return (
      this.clienteForm.get('nombres')?.invalid &&
      this.clienteForm.get('nombres')?.touched
    );
  }
  get apellidosNoValido() {
    return (
      this.clienteForm.get('apellidos')?.invalid &&
      this.clienteForm.get('apellidos')?.touched
    );
  }
  get correoNoValido() {
    return (
      this.clienteForm.get('correo')?.invalid &&
      this.clienteForm.get('correo')?.touched
    );
  }
  onCloseForm() {
    this.closebutton.nativeElement.click();
  }
  guardarCliente() {
    if (this.clienteForm.invalid) {
      return Object.values(this.clienteForm.controls).forEach((contr) => {
        if (contr instanceof FormGroup) {
          Object.values(contr.controls).forEach((contr) =>
            contr.markAllAsTouched()
          );
        } else {
          contr.markAsTouched();
        }
      });
    }

    const cliente: Cliente = {
      id: this.idCliente,
      nombres: this.clienteForm.value.nombres,
      activo: true,
      apellidos: this.clienteForm.value.apellidos,
      correo: this.clienteForm.value.correo,
      id_rol: this.idRol,
    };
    if (this.action == 'Agregar') {
      this.clienteService.ingresarCliente(cliente).subscribe((resp) => {
        if (resp.exito) {
          let user: Usuario = { ...resp.data };
          this.alertService
            .correcto(resp.data.nombre, resp.message)
            .then(() => {
              this.closebutton.nativeElement.click();
            });
          user.rol = this.rol;
          this.store.dispatch(new SetUsuario(user));
        } else {
          this.alertService.error('Error', resp.message);
        }
      });
    } else {
      this.clienteService.actualizarCliente(cliente).subscribe((resp) => {
        if (resp.exito) {
          this.alertService
            .correcto(resp.data.nombre, resp.message)
            .then(() => {
              this.closebutton.nativeElement.click();
              this.store.dispatch(new SetUsuario(resp?.data));
            });
        } else {
          this.alertService.error('Error', resp.message);
        }
      });
    }
  }
  search() {
    if (this.liatarForm.value.columna != '') {
      this.listarClientes();
    }
  }
  listarClientes() {
    var listar: Listar = {
      columna: this.liatarForm.value.columna,
      search: this.liatarForm.value.search,
      offset: this.liatarForm.value.offset,
      limit: this.liatarForm.value.limit || 10,
      sort: this.liatarForm.value.sort,
    };

    this.clienteService
      .obtenerClientes(this.idRol, listar)
      .subscribe((resp) => {
        this.clientes = resp;
        this.numeroPaginas = new Array(Math.ceil(this.clientes.length / 10));
        this.cargando = false;
      });
  }

  editarCliente(user: Usuario) {
    this.action = 'Editar';
    this.submitType = 'Actualizar';
    this.idCliente = user?.id;
    this.cliente = user;
    this.clienteForm.patchValue({
      nombres: user.nombres,
      apellidos: user.apellidos,
      correo: user.correo,
    });
  }

  eliminar(cliente: Cliente) {
    if (cliente.id != null) {
      Swal.fire({
        position: 'center',
        icon: 'question',
        title: 'Esta seguro que desea borrar a',
        text: `${cliente.nombres}`,
        showConfirmButton: true,
        showCancelButton: true,
      }).then((resp) => {
        if (resp.value) {
          this.clienteService.eliminarCliente(cliente.id).subscribe((resp) => {
            if (resp.exito) {
              this.alertService.correcto('', resp.message).then(() => {
                this.store.dispatch(new RemoveUsuario(resp?.id));
              });
            } else {
              this.alertService.error('Error', resp.message);
            }
          });
        }
      });
    }
  }

  exportarReporte() {
    const listar: Listar = {
      columna: this.liatarForm.value.columna,
      search: this.liatarForm.value.search,
      offset: this.liatarForm.value.offset,
      limit: this.liatarForm.value.limit,
      sort: this.liatarForm.value.sort,
    };
    this.clienteService.exportarExcel(this.rol, listar).subscribe((blob) => {
      let fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl);
    });
  }

  getUser(usuario: Cliente) {
    this.usuario = usuario;
  }
  getSessiones(usuario: Cliente) {
    this.position = 0;
    this.showChats = true;
    this.getUser(usuario);
    var listar: Listar = {
      columna: 'createdAt',
      search: '',
      offset: 0,
      limit: '100',
      sort: '',
    };
    this.cargando = true;
    this.chatService.getSessiones(usuario?.id!, listar).subscribe((resp) => {
      this.sessiones = resp;
      this.cargando = false;
    });
  }
  backClients() {
    this.showChats = false;
    this.sessiones = [];
    this.messages = [];
  }
  cragarChat(idSession: string, i: number, fecha: Date) {
    this.fecha_chat_seleccionado = fecha;
    this.messages = [];
    this.position = i;
    this.cargandoMensajes = true;
    this.chatService.getChat(idSession).subscribe((resp) => {
      this.messages = resp;
      this.cargandoMensajes = false;
    });
  }
  localDate(date: any) {
    let utcDate = new Date(date);
    return new Date(
      utcDate.getTime() - utcDate.getTimezoneOffset() * 60 * 1000
    );
  }
  enviarChat() {
    this.alertService.esperando('Enviando chat ...');
    Swal.showLoading();
    html2canvas(document.querySelector('#chat-messages')!).then((canvas) => {
      const data: SendChat = {
        image: canvas.toDataURL(),
        comentario: '',
        usuario: this.usuario,
      };
      this.chatService
        .sendChat(data, sessionStorage.getItem('access-token')!)
        .subscribe(
          (resp) => {
            if (resp.exito) {
              this.alertService.correcto('', resp.message);
            } else {
              this.alertService.error('', resp.message);
            }
          },
          (error) => {
            this.alertService.error(
              'Error',
              'Ocurrio un proble porfavor intentelo de nuevo.'
            );
          }
        );
    });
  }
}
