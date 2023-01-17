import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { AlertService } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormsService } from 'src/app/services/forms.service';
import { HelpersService } from 'src/app/services/helpers.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { SetAccount } from 'src/app/store/Account/account.actions';
import { SetAccountState } from 'src/app/store/Account/account.state';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  usuario!: Usuario;
  cargando = true;
  usuarioForm!: FormGroup;
  actualizarForm!: FormGroup;
  showPassword1: Boolean = false;
  showPassword2: Boolean = false;
  passwordtype1: String = 'password';
  passwordtype2: String = 'password';
  classhow1: String = 'far fa-eye-slash nav-icon';
  classhow2: String = 'far fa-eye-slash nav-icon';
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closebuttonChange') closebuttonChange: any;
  constructor(
    private formService: FormsService,
    private alertService: AlertService,
    private authservices: AuthenticationService,
    private helperService: HelpersService,
    private usuarioService: UsuarioService,
    private store: Store
  ) {
    this.usuarioForm = formService.crearFormularioUsuario();
    this.actualizarForm = formService.crearFormularioActualizarPass();
  }

  ngOnInit(): void {
    this.getAccount();
  }
  getAccount() {
    this.cargando = true;
    this.store.select(SetAccountState.getAccount).subscribe((user) => {
      this.usuario = user!;
      this.cargando = false;
    });
  }
  initialsName(name: string) {
    return this.helperService.initialLettersName(name);
  }
  visibilitiPassword(option: number) {
    if (option === 1) {
      if (!this.showPassword1) {
        this.showPassword1 = true;
        this.passwordtype1 = 'password';
        this.classhow1 = 'far fa-eye-slash nav-icon';
      } else {
        this.showPassword1 = false;
        this.passwordtype1 = 'text';
        this.classhow1 = 'far fa-eye nav-icon';
      }
    }
    if (option === 2) {
      if (!this.showPassword2) {
        this.showPassword2 = true;
        this.passwordtype2 = 'password';
        this.classhow2 = 'far fa-eye-slash nav-icon';
      } else {
        this.showPassword2 = false;
        this.passwordtype2 = 'text';
        this.classhow2 = 'far fa-eye nav-icon';
      }
    }
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

  get clave1NoValido() {
    return (
      this.actualizarForm.get('clave')?.invalid &&
      this.actualizarForm.get('clave')?.touched
    );
  }

  get clave2NoValido() {
    const pass1 = this.actualizarForm.get('clave')?.value;
    const pass2 = this.actualizarForm.get('rclave')?.value;
    return pass1 === pass2 ? false : true;
  }
  obtenetPerfil() {
    this.usuarioForm.patchValue({
      nombres: this.usuario.nombres,
      apellidos: this.usuario.apellidos,
      telefono: this.usuario.telefono,
      correo: this.usuario.correo,
    });
  }
  actualizarPerfil() {
    const usuario: Usuario = {
      id: this.usuario?.id,
      nombres: this.usuarioForm.value.nombres,
      apellidos: this.usuarioForm.value.apellidos,
      telefono: this.usuarioForm.value.telefono,
      correo: this.usuarioForm.value.correo,
      id_rol: this.usuario?.id_rol,
      activo: true,
    };
    this.alertService.esperando('Guardar informacion....');
    Swal.showLoading();
    this.usuarioService.actualizarUsuario(usuario).subscribe((resp) => {
      if (resp?.exito) {
        this.usuario = resp.data;
        this.store.dispatch(new SetAccount(this.usuario));
        this.alertService.correcto('Actualización de Perfil', resp?.message);
        this.closebutton.nativeElement.click();
      }
    });
  }

  actualizarPassword() {
    let clave = this.actualizarForm.value.clave;
    let token = sessionStorage.getItem('acces-token') ?? '';
    this.alertService.esperando('Guardar informacion....');
    Swal.showLoading();
    this.authservices.actualizarClave(clave, token).subscribe((resp) => {
      if (resp?.exito) {
        this.alertService.correcto('', resp?.message);
        this.closebuttonChange.nativeElement.click();
      } else {
        this.alertService.error(
          'Error al cambiar la contraseña',
          resp?.message
        );
      }
    });
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.controls[pass1Name];
      const pass2Control = formGroup.controls[pass1Name];
      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    };
  }
}
