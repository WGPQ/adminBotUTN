import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Intencion } from 'src/app/interfaces/intencion.interface';
import { Listar } from 'src/app/interfaces/listar.interface';
import { AlertService } from 'src/app/services/alert.service';
import { FormsService } from 'src/app/services/forms.service';
import { IntencionService } from 'src/app/services/intencion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-intents',
  templateUrl: './intents.component.html',
  styles: [
  ]
})
export class IntentsComponent implements OnInit {
  intenciones: Intencion[] = [];
  intencionForm!: FormGroup;
  listarForm!: FormGroup;
  submitType: string = "Guardar";
  action = "Agregar";
  idIntencion?: string;
  cargando = false;
  @ViewChild('closebutton') closebutton: any;
  constructor(
    private intencionService: IntencionService,
    private alertService: AlertService,
    private formService: FormsService
  ) {
    this.cargando = true;
    this.intencionForm = formService.crearFormularioIntencion();
    this.listarForm = formService.crearFormularioListar();
  }

  ngOnInit(): void {
    this.listarIntencion();
  }

  search() {
    if (this.listarForm.value.columna != "") {
      this.listarIntencion();
    }
  }
  listarIntencion() {
    var listar: Listar = {
      columna: this.listarForm.value.columna,
      search: this.listarForm.value.search,
      offset: this.listarForm.value.offset,
      limit: this.listarForm.value.limit,
      sort: this.listarForm.value.sort,
    }
    this.intencionService.obtenerIntenciones(listar).subscribe(response => {
      this.intenciones = response;
      this.cargando = false;
    });
  }

  nuevo() {
    this.intencionForm.reset();
    this.action = "Agregar"
    this.submitType = "Guardar";
  }


  get codigoNoValido() {
    return this.intencionForm.get('codigo')?.invalid && this.intencionForm.get('codigo')?.touched;
  }
  get nombreNoValido() {
    return this.intencionForm.get('nombre')?.invalid && this.intencionForm.get('nombre')?.touched;
  }
  get descripcionNoValida() {
    return this.intencionForm.get('descripcion')?.invalid && this.intencionForm.get('descripcion')?.touched;
  }
  guardarIntencion() {
    const intencion: Intencion = {
      id: this.idIntencion ?? '',
      nombre: this.intencionForm.value.nombre,
      descripcion: this.intencionForm.value.descripcion,
    };

    this.alertService.esperando('Guardar informacion....');
    Swal.showLoading();

    if (this.action == "Agregar") {
      this.intencionService.ingresarIntencion(intencion).subscribe(resp => {
        if (resp.exito) {
          this.alertService.correcto(`${resp.data.nombre} ${resp.data.descripcion}`, resp.message).then(() => {
            this.closebutton.nativeElement.click();
            this.listarIntencion();
          });
        } else {


          this.alertService.error('Error', resp.message);
        }
      });
    } else {
      this.intencionService.actualizarIntencion(intencion).subscribe(resp => {
        if (resp.exito) {
          this.alertService.correcto(`${resp.data.nombre} ${resp.data.descripcion}`, resp.message).then(() => {
            this.closebutton.nativeElement.click();
            this.listarIntencion();
          });
        } else {
          this.alertService.error('Error', resp.message);
        }
      }, (err => {
        console.log(err);
        this.alertService.error('Error al actualizar', `${err.status} ${err.statusText}`);
      }));
    }
  }

  editar(id?: string) {
    this.action = "Editar"
    this.submitType = "Actualizar";
    this.idIntencion = id;
    this.intencionService.obtenerIntencion(id).subscribe((resp) => {
      this.intencionForm.patchValue({
        nombre: resp.nombre,
        descripcion: resp.descripcion
      });
    });
  }
  eliminar(intencion: Intencion) {
    if (intencion.id != null) {
      Swal.fire({
        position: 'center',
        icon: 'question',
        title: 'Esta seguro que desea borrar a:',
        text: `${intencion.nombre}`,
        showConfirmButton: true,
        showCancelButton: true,
      }).then(resp => {

        if (resp.value) {

          this.intencionService.eliminarIntencion(intencion.id).subscribe(resp => {
            if (resp.exito) {
              this.alertService.correcto('', resp.message).then(() => {
                this.listarIntencion();
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
      columna: "",
      search: "",
      offset: 0,
      limit: 1000,
      sort: ""
    }
    this.intencionService.exportarExcel(listar).subscribe(blob => {
      let fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl);
    });
  }

}
