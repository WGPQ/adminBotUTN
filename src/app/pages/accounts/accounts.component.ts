import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngxs/store';
import { Listar } from 'src/app/interfaces/listar.interface';
import { Rol } from 'src/app/interfaces/rol.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { AlertService } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormsService } from 'src/app/services/forms.service';
import { HelpersService } from 'src/app/services/helpers.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SetAccount } from 'src/app/store/Account/account.actions';
import { SetAccountState } from 'src/app/store/Account/account.state';
import { RolesState } from 'src/app/store/Roles/roles.state';
import {
  RemoveUsuario,
  SetUsuario,
} from 'src/app/store/Usuarios/usuarios.actions';
import { UsuariosState } from 'src/app/store/Usuarios/usuarios.state';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent implements OnInit, OnDestroy {
  usuarios: Usuario[] = [];
  perfil?: Usuario;
  roles: Rol[] = [];
  usuarioForm!: FormGroup;
  liatarForm!: FormGroup;
  submitType: string = 'Guardar';
  action = 'Agregar';
  idUsuario?: string;
  rol?: string;
  rolId?: string;
  nuevoUsuario: boolean = false;
  loading = true;
  showModal = true;
  titlePage: string = '';
  pagina = 0;
  paginaActiva = 0;
  numeroPaginas = new Array(1);
  previus = false;
  next = true;
  setTimeRef: any;
  @ViewChild('closebutton') closebutton: any;
  public customPatterns = { '0': { pattern: new RegExp('^[0-9]*$') } };
  constructor(
    private usuarioService: UsuarioService,
    private store: Store,
    private fb: FormBuilder,
    private authservices: AuthenticationService,
    private alertService: AlertService,
    private router: ActivatedRoute,
    private helperService: HelpersService,
    private modulosService: ModulosService,
    private formService: FormsService
  ) {
    this.loading = true;
    this.usuarioForm = formService.crearFormularioUsuario();
    this.liatarForm = formService.crearFormularioListar();
  }

  ngOnInit(): void {
    this.router.paramMap.subscribe((params: ParamMap) => {
      var nombreRol = params.get('rol');
      this.listarRoles(nombreRol!);
      this.fetchUsuarios(nombreRol!);
    });
  }

  obtenetTitlepage(rol: string) {
    if (rol) {
      var modulos = this.modulosService.getModulos('Administrador');
      var usuarios = modulos.find((m) => m.nombre === 'Cuentas')?.submenu;
      this.titlePage = usuarios?.find((u) => u.ruta === rol)?.nombre!;
    }
  }

  exportarReporte() {
    const listar: Listar = {
      columna: this.liatarForm.value.columna,
      search: this.liatarForm.value.search,
      offset: this.liatarForm.value.offset || 0,
      limit: this.liatarForm.value.limit || 10,
      sort: this.liatarForm.value.sort,
    };
    this.usuarioService.exportarExcel(this.rolId!, listar).subscribe((blob) => {
      let fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl);
    });
  }

  subirFoto(event: any) {
    var file = event.target.files[0];
    if (file) {
      var formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('upload_preset', 'bibliochat_utn');
      formData.append('cloud_name', 'dw9uf4st5');
      this.usuarioService.subirFotoCloudinary(formData).subscribe((resp) => {
        if (resp) {
          const { secure_url } = resp;
          this.usuarioForm.patchValue({
            foto: secure_url,
          });
        }
      });
    }
  }

  crearFormulario() {
    this.usuarioForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      rol: [0, [Validators.required]],
      activo: [true],
    });
  }

  get nombresNoValido() {
    return (
      this.usuarioForm.get('nombres')?.invalid &&
      this.usuarioForm.get('nombres')?.touched
    );
  }
  get apellidosNoValida() {
    return (
      this.usuarioForm.get('apellidos')?.invalid &&
      this.usuarioForm.get('apellidos')?.touched
    );
  }
  get correoNoValido() {
    return (
      this.usuarioForm.get('correo')?.invalid &&
      this.usuarioForm.get('correo')?.touched
    );
  }

  get telefonoNoValida() {
    return (
      this.usuarioForm.get('telefono')?.invalid &&
      this.usuarioForm.get('telefono')?.touched
    );
  }

  limitar() {
    this.listar();
  }

  ngOnDestroy(): void {
    clearTimeout(this.setTimeRef);
  }
  initialsName(name: string) {
    return this.helperService.initialLettersName(name);
  }

  fetchUsuarios(rol: string) {
    this.store
      .select(UsuariosState.getUsuariosList)
      .subscribe((usuariosList: Usuario[]) => {
        this.usuarios = usuariosList.filter(
          (usuario) => usuario.rol?.toLowerCase() === rol.toLowerCase()
        );
        this.numeroPaginas = new Array(Math.ceil(this.usuarios.length / 10));
        this.setTimeRef = setTimeout(() => (this.loading = false), 500);
        this.obtenetTitlepage(rol);
      });
    this.store.select(SetAccountState.getAccount).subscribe((user) => {
      this.perfil = user!;
    });
  }

  search() {
    if (this.liatarForm.value.columna != '') {
      this.listar();
    }
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
    this.next = this.pagina + 10 < this.usuarios.length ? true : false;
    this.paginaActiva = nPagina;
  }
  nextPage() {
    if (this.usuarios.length > this.pagina) {
      this.pagina += 10;
      this.paginaActiva += 1;
      this.previus = true;
      this.next = this.pagina + 10 < this.usuarios.length ? true : false;
    }
  }

  listar() {
    var listar: Listar = {
      columna: this.liatarForm.value.columna,
      search: this.liatarForm.value.search,
      offset: this.liatarForm.value.offset,
      limit: this.liatarForm.value.limit || 10,
      sort: this.liatarForm.value.sort,
    };
    this.loading = true;

    this.usuarioService
      .obtenerUsuarios(this.rol!, listar)
      .subscribe((resp: any) => {
        this.usuarios = resp;
        this.numeroPaginas = new Array(Math.ceil(this.usuarios.length / 10));
        this.loading = false;
      });
  }
  listarRoles(rolName: string) {
    this.store.select(RolesState.getRolesList).subscribe((rolesList: Rol[]) => {
      this.roles = rolesList;
      this.rolId = rolesList.find((rol) => rol?.nombre == rolName)?.id;
    });
  }
  nuevo() {
    this.usuarioForm.reset({
      rol: '',
    });
    this.action = 'Agregar';
    this.submitType = 'Guardar';
    this.nuevoUsuario = false;
  }
  guardar() {
    const usuario: Usuario = {
      id: this.idUsuario ?? '',
      foto: this.usuarioForm.value.foto,
      nombres: this.usuarioForm.value.nombres,
      apellidos: this.usuarioForm.value.apellidos,
      telefono: this.usuarioForm.value.telefono,
      correo: this.usuarioForm.value.correo,
      id_rol: this.usuarioForm.value.id_rol,
      activo: this.usuarioForm.value.activo ?? true,
    };

    this.alertService.esperando('Guardar informacion....');
    Swal.showLoading();

    if (this.action == 'Agregar') {
      this.usuarioService.ingresarUsuario(usuario).subscribe((resp) => {
        if (resp.exito) {
          let user: Usuario = { ...resp.data };
          this.alertService
            .correcto(
              `${resp.data.nombres} ${resp.data.apellidos}`,
              resp.message
            )
            .then(() => {
              this.closebutton.nativeElement.click();
            });

          user.rol = this.roles.find((r) => r?.id === user?.id_rol)?.nombre;
          this.store.dispatch(new SetUsuario(user));
        } else {
          this.alertService.error('Error', resp.message);
        }
      });
    } else {
      this.usuarioService.actualizarUsuario(usuario).subscribe(
        (resp) => {
          if (resp.exito) {
            this.alertService
              .correcto(
                `${resp.data.nombres} ${resp.data.apellidos}`,
                resp.message
              )
              .then(() => {
                this.closebutton.nativeElement.click();
                this.store.dispatch(new SetUsuario(resp?.data));
                if (this.idUsuario == this.perfil?.id) {
                  this.store.dispatch(new SetAccount(resp?.data));
                }
              });
          } else {
            this.alertService.error('Error al actualizar', resp.message);
          }
        },
        (err) => {
          console.log(err);
          Swal.fire({
            position: 'top',
            icon: 'error',
            title: 'Error al actualizar',
            text: `${err.status} ${err.statusText}`,
            timer: 2500,
          });
        }
      );
    }
  }
  eliminar(usuario: Usuario) {
    if (usuario.id != '') {
      Swal.fire({
        position: 'center',
        icon: 'question',
        title: 'Esta seguro que desea borrar a:',
        text: `${usuario.nombres} ${usuario.apellidos}`,
        showConfirmButton: true,
        showCancelButton: true,
      }).then((resp) => {
        if (resp.value) {
          if (usuario.id != this.perfil?.id) {
            this.usuarioService
              .eliminarUsuario(usuario.id)
              .subscribe((resp) => {
                if (resp.exito) {
                  this.alertService.correcto('', resp.message).then(() => {
                    this.store.dispatch(new RemoveUsuario(resp?.id));
                  });
                } else {
                  this.alertService.error('Error', resp.message);
                }
              });
          } else {
            this.alertService.error(
              'Error',
              'No se puede eliminar su propio registro'
            );
          }
        }
      });
    }
  }

  editar(user: Usuario) {
    this.action = 'Editar';
    this.submitType = 'Actualizar';
    this.idUsuario = user?.id;
    this.nuevoUsuario = true;
    this.usuarioForm.patchValue({
      foto: user.foto,
      nombres: user.nombres,
      apellidos: user.apellidos,
      telefono: user.telefono,
      correo: user.correo,
      id_rol: user.id_rol,
      activo: user.activo,
    });
  }

  resetearContrasenia() {
    var correo = this.usuarioForm.get('correo')?.value;
    if (correo != null) {
      Swal.fire({
        position: 'center',
        icon: 'question',
        title: `Esta seguro que desea resetar la contraseña`,
        showConfirmButton: true,
        showCancelButton: true,
      }).then((resp) => {
        if (resp.value) {
          this.alertService.esperando('Esperere por favor ...');
          Swal.showLoading();
          this.authservices.resetearClave(correo).subscribe((resp) => {
            if (resp.exito) {
              this.alertService.correcto('', resp.message);
            } else {
              this.alertService.error('Error', resp.message);
            }
          });
        }
      });
    }
  }
}
