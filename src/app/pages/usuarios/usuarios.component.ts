import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  NavigationEnd,
  ParamMap,
  Router,
} from '@angular/router';
import { delay } from 'rxjs/operators';
import { Listar } from 'src/app/interfaces/listar.interface';
import { Rol } from 'src/app/interfaces/rol.interface';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { AlertService } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormsService } from 'src/app/services/forms.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { RolService } from 'src/app/services/rol.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  usuarioForm!: FormGroup;
  liatarForm!: FormGroup;
  submitType: string = 'Guardar';
  action = 'Agregar';
  idUsuario?: string;
  rol?: string;
  nuevoUsuario: boolean = false;
  loading = false;
  showModal = true;
  titlePage: string = '';
  pagina = 0;
  paginaActiva = 0;
  numeroPaginas = new Array(1);
  previus = false;
  next = true;
  @ViewChild('closebutton') closebutton: any;
  public customPatterns = { '0': { pattern: new RegExp('^[0-9]*$') } };
  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private fb: FormBuilder,
    private authservices: AuthenticationService,
    private alertService: AlertService,
    private router: ActivatedRoute,
    private modulosService: ModulosService,
    private formService: FormsService
  ) {
    this.loading = true;
    this.listarRoles();
    this.usuarioForm = formService.crearFormularioUsuario();
    this.liatarForm = formService.crearFormularioListar();
  }

  ngOnInit(): void {
    this.router.paramMap.subscribe((params: ParamMap) => {
      var nombreRol = params.get('rol');
      this.obtenetTitlepage(nombreRol!);
      if (nombreRol != null) {
        this.loading = true;
        setTimeout(() => {
          this.roles.find((r) =>
            r.nombre == nombreRol ? (this.rol = r.id) : (this.rol = '')
          );
          if (this.rol != null) {
            this.listar();
          }
        }, 1000);
      }
    });
  }

  obtenetTitlepage(rol: string) {
    if (rol) {
      var modulos = this.modulosService.getModulos('Administrador');
      console.log(modulos);
      var usuarios = modulos.find((m) => m.nombre === 'Usuarios')?.submenu;
      this.titlePage = usuarios?.find((u) => u.ruta === rol)?.nombre!;
      console.log(this.titlePage);
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
    this.usuarioService.exportarExcel(this.rol!, listar).subscribe((blob) => {
      let fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl);
    });
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
  listarRoles() {
    const listar: Listar = {
      columna: '',
      search: '',
      offset: 0,
      limit: '0',
      sort: '',
    };
    this.loading = true;
    this.rolService.obtenerRoles(listar).subscribe((resp) => {
      this.roles = resp;
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
          this.alertService
            .correcto(
              `${resp.data.nombres} ${resp.data.apellidos}`,
              resp.message
            )
            .then(() => {
              this.closebutton.nativeElement.click();
              this.listar();
            });
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
                this.listar();
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
          this.usuarioService.eliminarUsuario(usuario.id).subscribe((resp) => {
            if (resp.exito) {
              this.alertService.correcto('', resp.message).then(() => {
                this.listar();
              });
            } else {
              this.alertService.error('Error', resp.message);
            }
          });
        }
      });
    }
  }

  editar(id?: string) {
    this.action = 'Editar';
    this.submitType = 'Actualizar';
    this.idUsuario = id;
    this.nuevoUsuario = true;
    this.usuarioService.obtenerUsuario(id).subscribe((resp) => {
      this.usuarioForm.patchValue({
        nombres: resp.nombres,
        apellidos: resp.apellidos,
        telefono: resp.telefono,
        correo: resp.correo,
        id_rol: resp.id_rol,
        activo: resp.activo,
      });
    });
  }

  resetearContrasenia() {
    if (this.idUsuario != null) {
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
          this.authservices.resetearClave(this.idUsuario).subscribe((resp) => {
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
