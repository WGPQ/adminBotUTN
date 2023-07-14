import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/interfaces/login.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
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
  usuario!: Usuario;
  loginForm!: FormGroup;
  showPassword: Boolean = false;
  passwordtype: String = 'password';
  classhow: String = 'far fa-eye-slash nav-icon';
  loading: boolean = false;
  hasAuthLoading: boolean = true;
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
    if (this.authservices?.estaAutenticado()) {
      this.hasAuthLoading = true;
      try {
        this.authservices.verificarToken().subscribe((resp) => {
          console.log(resp);
          this.hasAuthLoading = false;
          if (resp) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/confirmar']);
          }
        });
      } catch (error) {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
      this.hasAuthLoading = false;
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
      this.alertService.esperando('Autentificando...');
      Swal.showLoading();
      const usuario: Login = {
        correo: this.loginForm.value.correo,
        clave: this.loginForm.value.clave,
      };
      this.loading = true;
      if (this.loginForm.value.recordarme) {
        localStorage.setItem('correo', usuario.correo);
      } else {
        localStorage.removeItem('correo');
      }
      this.authservices.acceso(usuario).subscribe((resp) => {
        if (resp) {
          this.authservices.verificarToken().subscribe((resp) => {
            if (resp) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/confirmar']);
            }
          });

          this.loading = false;
          Swal.close();
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

  validarToken(usuario: Usuario) {
    try {
      console.log('ya ingreso F', usuario);

      //   this.authservices.verificarToken().subscribe((resp) => {
      //     if (resp) {
      // this.store.select(SetAccountState.getAccount).subscribe((user) => {
      //   console.log(user);
      if (usuario?.verificado) {
        // this.router.navigate(['/dashboard']);
        // this.alertService.correcto('', 'Acceso Correcto');
        // Swal.close();
      } else {
      }
      // });
      //     } else {
      //       this.loading = false;
      //       this.alertService.error(
      //         'Error',
      //         'Ocurrio un proble porfavor intentelo de nuevo.'
      //       );
      //       Swal.close();
      //     }
      //   });
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
