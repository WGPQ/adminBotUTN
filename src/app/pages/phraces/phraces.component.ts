import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Frace } from 'src/app/interfaces/frace.interface';
import { Intencion } from 'src/app/interfaces/intencion.interface';
import { Listar } from 'src/app/interfaces/listar.interface';
import { AlertService } from 'src/app/services/alert.service';
import { FormsService } from 'src/app/services/forms.service';
import { FraceService } from 'src/app/services/frace.service';
import { RemoveFrace, SetFrace } from 'src/app/store/Fraces/fraces.actions';
import { FracesState } from 'src/app/store/Fraces/fraces.state';
import { IntencionesState } from 'src/app/store/Intenciones/intenciones.state';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-phraces',
  templateUrl: './phraces.component.html',
  styles: [],
})
export class PhracesComponent implements OnInit, OnDestroy {
  fraces: Frace[] = [];
  intenciones: Intencion[] = [];
  fraceForm!: FormGroup;
  listarForm!: FormGroup;
  submitType: string = 'Guardar';
  action = 'Agregar';
  idFrace?: string;
  nuevaFrace: boolean = false;
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
    private fraceaService: FraceService,
    private alertService: AlertService,
    private formService: FormsService
  ) {
    this.cargando = true;
    this.listarIntenciones();
    this.fraceForm = formService.crearFormularioFrace();
    this.listarForm = formService.crearFormularioListar();
  }
  ngOnInit(): void {
    this.fetchFraces();
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
    this.next = this.pagina + 10 < this.fraces.length ? true : false;
    this.paginaActiva = nPagina;
  }
  nextPage() {
    if (this.fraces.length > this.pagina) {
      this.pagina += 10;
      this.paginaActiva += 1;
      this.previus = true;
      this.next = this.pagina + 10 < this.fraces.length ? true : false;
    }
  }

  limitar() {
    this.listarFrace();
  }
  search() {
    if (this.listarForm.value.columna != '') {
      this.listarFrace();
    }
  }
  listarIntenciones() {
    this.store
      .select(IntencionesState.getIntencionesList)
      .subscribe((intencionesList: Intencion[]) => {
        this.intenciones = intencionesList;
      });
  }

  fetchFraces() {
    this.store
      .select(FracesState.getFracesList)
      .subscribe((fracesList: Frace[]) => {
        this.fraces = fracesList;
        this.numeroPaginas = new Array(Math.ceil(this.fraces.length / 10));
        this.setTimeRef = setTimeout(() => (this.cargando = false), 450);
      });
  }
  listarFrace() {
    var listar: Listar = {
      columna: this.listarForm.value.columna,
      search: this.listarForm.value.search,
      offset: this.listarForm.value.offset,
      limit: this.listarForm.value.limit || 10,
      sort: this.listarForm.value.sort,
    };

    this.fraceaService.obtenerFraces(listar).subscribe((response) => {
      this.fraces = response;
      this.cargando = false;
      this.numeroPaginas = new Array(Math.ceil(this.fraces.length / 10));
    });
  }

  nuevo() {
    this.fraceForm.reset({
      intencion: '',
    });
    this.action = 'Agregar';
    this.submitType = 'Guardar';
    this.nuevaFrace = false;
  }
  get intencionNoValido() {
    return (
      this.fraceForm.get('intencion')?.invalid &&
      this.fraceForm.get('intencion')?.touched
    );
  }
  get fraceNoValida() {
    return (
      this.fraceForm.get('frace')?.invalid &&
      this.fraceForm.get('frace')?.touched
    );
  }

  onCloseForm() {
    this.closebutton.nativeElement.click();
  }

  guardarFrace() {
    const frace: Frace = {
      id: this.idFrace ?? '',
      intencion: this.fraceForm.value.intencion,
      frace: this.fraceForm.value.frace,
      activo: this.fraceForm.value.activo ?? true,
    };

    this.alertService.esperando('Guardar informacion....');
    Swal.showLoading();

    if (this.action == 'Agregar') {
      this.fraceaService.ingresarFrace(frace).subscribe((resp) => {
        if (resp.exito) {
          this.alertService.correcto('', resp.message).then(() => {
            this.closebutton.nativeElement.click();
          this.store.dispatch(new SetFrace(resp?.data));
          });
        } else {
          this.alertService.error('Error', resp.message);
        }
      });
    } else {
      this.fraceaService.actualizarFrace(frace).subscribe(
        (resp) => {
          if (resp.exito) {
            this.alertService.correcto('', resp.message).then(() => {
              this.closebutton.nativeElement.click();
            this.store.dispatch(new SetFrace(resp?.data));

            });
          } else {
            this.alertService.error('Error', resp.message);
          }
        },
        (err) => {
          this.alertService.error(
            'Error al actualizar',
            `${err.status} ${err.statusText}`
          );
        }
      );
    }
  }
  editar(frace: Frace) {
    this.action = 'Editar';
    this.submitType = 'Actualizar';
    this.idFrace = frace?.id;
    this.nuevaFrace = true;
    this.fraceForm.patchValue({
      intencion: frace.intencion,
      frace: frace.frace,
      activo: frace.activo,
    });
  }
  eliminar(frace: Frace) {
    if (frace.id != null) {
      Swal.fire({
        position: 'center',
        icon: 'question',
        title: 'Esta seguro que desea borrar :',
        text: frace.frace,
        showConfirmButton: true,
        showCancelButton: true,
      }).then((resp) => {
        if (resp.value) {
          this.fraceaService.eliminarFrace(frace.id).subscribe((resp) => {
            if (resp.exito) {
              this.alertService.correcto('', resp.message).then(() => {
                this.store.dispatch(new RemoveFrace(resp?.id));
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
    this.fraceaService.exportarExcel(listar).subscribe((blob) => {
      let fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl);
    });
  }
}
