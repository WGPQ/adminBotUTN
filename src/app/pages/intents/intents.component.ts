import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Intencion } from 'src/app/interfaces/intencion.interface';
import { Listar } from 'src/app/interfaces/listar.interface';
import { AlertService } from 'src/app/services/alert.service';
import { FormsService } from 'src/app/services/forms.service';
import { IntencionService } from 'src/app/services/intencion.service';
import {
  RemoveIntencion,
  SetIntencion,
} from 'src/app/store/Intenciones/intenciones.actions';
import { IntencionesState } from 'src/app/store/Intenciones/intenciones.state';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-intents',
  templateUrl: './intents.component.html',
  styles: [],
})
export class IntentsComponent implements OnInit, OnDestroy {
  intenciones: Intencion[] = [];
  intencionForm!: FormGroup;
  listarForm!: FormGroup;
  submitType: string = 'Guardar';
  action = 'Agregar';
  idIntencion?: string;
  cargando = false;
  pagina = 0;
  paginaActiva = 0;
  numeroPaginas = new Array(1);
  previus = false;
  next = true;
  setTimeRef: any;
  @ViewChild('closebutton') closebutton: any;
  constructor(
    private store: Store,
    private intencionService: IntencionService,
    private alertService: AlertService,
    private formService: FormsService
  ) {
    this.cargando = true;
    this.intencionForm = formService.crearFormularioIntencion();
    this.listarForm = formService.crearFormularioListar();
  }

  ngOnInit(): void {
    this.fetchIntenciones();
  }

  ngOnDestroy(): void {
    clearTimeout(this.setTimeRef);
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
    this.next = this.pagina + 10 < this.intenciones.length ? true : false;
    this.paginaActiva = nPagina;
  }
  nextPage() {
    if (this.intenciones.length > this.pagina) {
      this.pagina += 10;
      this.paginaActiva += 1;
      this.previus = true;
      this.next = this.pagina + 10 < this.intenciones.length ? true : false;
    }
  }

  limitar() {
    this.listarIntencion();
  }

  search() {
    if (this.listarForm.value.columna != '') {
      this.listarIntencion();
    }
  }

  fetchIntenciones() {
    this.store
      .select(IntencionesState.getIntencionesList)
      .subscribe((intencionesList: Intencion[]) => {
        this.intenciones = intencionesList;
        this.numeroPaginas = new Array(Math.ceil(this.intenciones.length / 10));
        this.setTimeRef = setTimeout(() => (this.cargando = false), 450);
      });
  }
  listarIntencion() {
    var listar: Listar = {
      columna: this.listarForm.value.columna,
      search: this.listarForm.value.search,
      offset: this.listarForm.value.offset,
      limit: this.listarForm.value.limit || 10,
      sort: this.listarForm.value.sort,
    };
    this.intencionService.obtenerIntenciones(listar).subscribe((response) => {
      this.intenciones = response;
      this.numeroPaginas = new Array(Math.ceil(this.intenciones.length / 10));
      this.cargando = false;
    });
  }

  nuevo() {
    this.intencionForm.reset();
    this.action = 'Agregar';
    this.submitType = 'Guardar';
  }

  get codigoNoValido() {
    return (
      this.intencionForm.get('codigo')?.invalid &&
      this.intencionForm.get('codigo')?.touched
    );
  }
  get nombreNoValido() {
    return (
      this.intencionForm.get('nombre')?.invalid &&
      this.intencionForm.get('nombre')?.touched
    );
  }
  get descripcionNoValida() {
    return (
      this.intencionForm.get('descripcion')?.invalid &&
      this.intencionForm.get('descripcion')?.touched
    );
  }
  guardarIntencion() {
    const intencion: Intencion = {
      id: this.idIntencion ?? '',
      nombre: this.intencionForm.value.nombre,
      descripcion: this.intencionForm.value.descripcion,
    };

    this.alertService.esperando('Guardar informacion....');
    Swal.showLoading();

    if (this.action == 'Agregar') {
      this.intencionService.ingresarIntencion(intencion).subscribe((resp) => {
        if (resp.exito) {
          this.alertService
            .correcto(
              `${resp.data.nombre} ${resp.data.descripcion}`,
              resp.message
            )
            .then(() => {
              this.closebutton.nativeElement.click();
              this.store.dispatch(new SetIntencion(resp?.data));
            });
        } else {
          this.alertService.error('Error', resp.message);
        }
      });
    } else {
      this.intencionService.actualizarIntencion(intencion).subscribe(
        (resp) => {
          if (resp.exito) {
            this.alertService
              .correcto(`${resp.data.nombre}`, resp.message)
              .then(() => {
                this.closebutton.nativeElement.click();
                this.store.dispatch(new SetIntencion(resp?.data));
              });
          } else {
            this.alertService.error('Error', resp.message);
          }
        },
        (err) => {
          console.log(err);
          this.alertService.error(
            'Error al actualizar',
            `${err.status} ${err.statusText}`
          );
        }
      );
    }
  }

  editar(intencion: Intencion) {
    this.action = 'Editar';
    this.submitType = 'Actualizar';
    this.idIntencion = intencion?.id;
    this.intencionForm.patchValue({
      nombre: intencion?.nombre,
      descripcion: intencion?.descripcion,
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
      }).then((resp) => {
        if (resp.value) {
          this.intencionService
            .eliminarIntencion(intencion.id)
            .subscribe((resp) => {
              if (resp.exito) {
                this.alertService.correcto('', resp.message).then(() => {
                  this.store.dispatch(new RemoveIntencion(resp?.id));
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
      columna: this.listarForm.value.columna,
      search: this.listarForm.value.search,
      offset: this.listarForm.value.offset,
      limit: this.listarForm.value.limit || 10,
      sort: this.listarForm.value.sort,
    };
    this.intencionService.exportarExcel(listar).subscribe((blob) => {
      let fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl);
    });
  }
}
