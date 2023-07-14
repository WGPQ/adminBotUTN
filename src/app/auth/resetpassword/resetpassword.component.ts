import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormsService } from 'src/app/services/forms.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
})
export class ResetpasswordComponent implements OnInit {
  resetForm!: FormGroup;
  loading: boolean = false;
  sendReset: boolean = false;
  succesReset: boolean = false;
  email: string = '';
  constructor(
    private alertService: AlertService,
    private authservices: AuthenticationService,
    private formService: FormsService
  ) {
    this.resetForm = formService.crearFormularioReset();
  }

  ngOnInit(): void {}
  get correoNoValido() {
    return (
      this.resetForm.get('correo')?.invalid &&
      this.resetForm.get('correo')?.touched
    );
  }

  resetearContrasenia() {
    try {
      if (this.resetForm.invalid) {
        return Object.values(this.resetForm.controls).forEach((contr) => {
          if (contr instanceof FormGroup) {
            Object.values(contr.controls).forEach((contr) =>
              contr.markAllAsTouched()
            );
          } else {
            contr.markAsTouched();
          }
        });
      }
      this.loading = true;
      var correo = this.resetForm?.value.correo;
      this.email = correo;
      if (correo != null) {
        this.alertService.esperando('Esperere por favor ...');
        Swal.showLoading();
        this.authservices.resetearClave(correo).subscribe((resp) => {
          this.sendReset = true;
          if (resp.exito) {
            this.alertService.correcto('', resp.message);
            this.succesReset = true;
          } else {
            this.alertService.error('Error', resp.message);
            this.succesReset = false;
          }
          this.loading = false;
        });
      }
    } catch (error) {
      this.alertService.error('Error', 'Ocurrion un error inesperado');
      this.loading = false;
      this.succesReset = false;
    }
  }
}
