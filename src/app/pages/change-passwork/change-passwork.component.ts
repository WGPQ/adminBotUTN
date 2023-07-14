import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { AlertService } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormsService } from 'src/app/services/forms.service';
import { HelpersService } from 'src/app/services/helpers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-passwork',
  templateUrl: './change-passwork.component.html',
  styleUrls: ['./change-passwork.component.css'],
})
export class ChangePassworkComponent implements OnInit {
  actualizarForm!: FormGroup;
  usuario?: Usuario;
  loading: boolean = true;
  showPassword1: Boolean = false;
  showPassword2: Boolean = false;
  passwordtype1: String = 'password';
  passwordtype2: String = 'password';
  classhow1: String = 'far fa-eye-slash nav-icon';
  classhow2: String = 'far fa-eye-slash nav-icon';
  constructor(
    private formService: FormsService,
    private authservices: AuthenticationService,
    private alertService: AlertService,
    private helperService: HelpersService,
    private router: Router
  ) {
    this.actualizarForm = formService.crearFormularioActualizarPass();
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('access-token')) {
      try {
        if (!this.authservices.usuario) {
          this.authservices.verificarToken().subscribe(
            (resp) => {
              this.usuario = this.authservices.usuario;
            },
            (error) => {
              this.router.navigate(['/login']);
            }
          );
        } else {
          this.usuario = this.authservices.usuario;
        }
      } catch (error) {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  toLogin() {
    sessionStorage.removeItem('access-token');
    sessionStorage.removeItem('session');
    this.router.navigate(['/login']);
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
    return pass1 == pass2 ? false : true;
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
  actualizarPassword() {
    let clave = this.actualizarForm.value.clave;
    this.authservices
      ?.actualizarClave(clave, sessionStorage.getItem('access-token')!)
      .subscribe((resp) => {
        if (resp?.exito) {
          this.alertService.correcto('', resp?.message);
          this.authservices?.cerrarSesion();
          this.router.navigate(['#/login']);
        } else {
          this.alertService.error('Error al ingresar', resp?.message);
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
