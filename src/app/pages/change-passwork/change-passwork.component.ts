import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { AlertService } from 'src/app/services/alert.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormsService } from 'src/app/services/forms.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-passwork',
  templateUrl: './change-passwork.component.html',
  styles: [
  ]
})
export class ChangePassworkComponent implements OnInit {
  actualizarForm!: FormGroup;
  usuario?: Usuario;
  loading: boolean = true;
  token: string;
  constructor(
    private formService: FormsService,
    private authservices: AuthenticationService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.actualizarForm = formService.crearFormularioActualizarPass();
    this.token = sessionStorage.getItem('acces-token') ?? "";
    sessionStorage.removeItem('acces-token');
  }

  ngOnInit(): void {
    if (this.token != "") {
      this.usuario = this.authservices.usuario;
      if (this.usuario != null) {
        this.loading = false;
      }
    } else {
      this.router.navigate(['/login']);
    }


  }
  get clave1NoValido() {
    return this.actualizarForm.get('clave')?.invalid && this.actualizarForm.get('clave')?.touched;
  }

  get clave2NoValido() {
    const pass1 = this.actualizarForm.get('clave')?.value;
    const pass2 = this.actualizarForm.get('rclave')?.value;
    return (pass1 == pass2) ? false : true;
  }

  actualizarPassword() {
    let clave = this.actualizarForm.value.clave;
    this.authservices.actualizarClave(clave, this.token).subscribe(resp => {
      if (resp.exito) {
        this.alertService.correcto("", resp.message);
        this.authservices.cerrarSesion();
        this.router.navigate(['/login']);
      } else {
        this.alertService.error("Error al ingresar", resp.message);
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
        pass2Control.setErrors({ noEsIgual: true })
      }
    }
  }


}
