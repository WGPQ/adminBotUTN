import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/interfaces/login.interface';
import { AlertService } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BibliotecaService } from 'src/app/services/biblioteca.service';
import { FormsService } from 'src/app/services/forms.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit {
  usuario!: Login;
  loginForm!: FormGroup;
  showPassword: Boolean = false;
  passwordtype: String = 'password';
  classhow: String = 'far fa-eye-slash nav-icon';
  loading: boolean = false;
  constructor(
    private bibliotecaService: BibliotecaService,
    private formService: FormsService,
    private authservices: AuthenticationService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.loginForm = formService.crearFormularioLogin();
  }

  ngOnInit(): void {
    this.verificarLoggin();
    this.verificarRecordar();
  }
  visibilitiPassword() {
    if (!this.showPassword) {
      this.showPassword = true;
      this.passwordtype = 'password';
      this.classhow = 'far fa-eye-slash nav-icon';
    } else {
      this.showPassword = false;
      this.passwordtype = 'text';
      this.classhow = 'far fa-eye nav-icon';
    }
  }

  verificarLoggin() {
    if (
      this.authservices.estaAutenticado() &&
      this.authservices?.usuario?.verificado
    ) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  verificarRecordar() {
    if (this.loginForm.value.recordarme) {
      this.loginForm.patchValue({
        correo: localStorage.getItem('correo'),
      });
      this.loginForm.value.recordarme = true;
    }
  }

  verificarBackend() {
    this.bibliotecaService.checkConnection().subscribe((resp) => {});
  }

  get correoNoValido() {
    return (
      this.loginForm.get('correo')?.invalid &&
      this.loginForm.get('correo')?.touched
    );
  }
  get claveNoValida() {
    return (
      this.loginForm.get('clave')?.invalid &&
      this.loginForm.get('clave')?.touched
    );
  }

  login() {
    try {
      if (this.loginForm.invalid) {
        return Object.values(this.loginForm.controls).forEach((contr) => {
          if (contr instanceof FormGroup) {
            Object.values(contr.controls).forEach((contr) =>
              contr.markAllAsTouched()
            );
          } else {
            contr.markAsTouched();
          }
        });
      }

      const usuario: Login = {
        correo: this.loginForm.value.correo,
        clave: this.loginForm.value.clave,
      };
      this.loading = true;
      this.authservices.acceso(usuario).subscribe((resp) => {
        if (resp) {
          this.router.navigate(['/authenticate']);
          this.alertService.esperando('Autentificando');
          this.loading = false;
          if (this.loginForm.value.recordarme) {
            localStorage.setItem('correo', usuario.correo);
          } else {
            localStorage.removeItem('correo');
          }
          Swal.showLoading();
          this.validarToken();
        } else {
          this.loading = false;
        }
      });
    } catch (error) {
      this.loading = false;
      this.alertService.error(
        'Error',
        'Ocurrio un proble porfavor intentelo de nuevo.'
      );
      Swal.close();
    }
  }

  validarToken() {
    try {
      this.authservices.verificarToken().subscribe((resp) => {
        // setTimeout(() => {
        if (resp) {
          if (this.authservices?.usuario?.verificado) {
            this.router.navigate(['/dashboard']);
            this.alertService.correcto('', 'Acceso Correcto');
            Swal.close();
          } else {
            this.router.navigate(['/confirmar']);
            Swal.close();
          }
        } else {
          this.loading = false;
          this.alertService.error(
            'Error',
            'Ocurrio un proble porfavor intentelo de nuevo.'
          );
          Swal.close();
        }

        // }, 500);
      });
    } catch (error) {
      this.loading = false;
      this.alertService.error(
        'Error',
        'Ocurrio un proble porfavor intentelo de nuevo.'
      );
      Swal.close();
    }
  }
}
