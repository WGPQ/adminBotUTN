import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Listar } from 'src/app/interfaces/listar.interface';
import { Rol } from 'src/app/interfaces/rol.interface';
import { AlertService } from 'src/app/services/alert.service';
import { FormsService } from 'src/app/services/forms.service';
import { RolService } from 'src/app/services/rol.service';
import { RemoveRol, SetRol } from 'src/app/store/Roles/roles.actions';
import { RolesState } from 'src/app/store/Roles/roles.state';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styles: [],
})
export class RolesComponent implements OnInit, OnDestroy {
  roles: Rol[] = [];
  rolForm!: FormGroup;
  liatarForm!: FormGroup;
  submitType: string = 'Guardar';
  action = 'Agregar';
  idRol?: string;
  rol!: Rol;
  cargando = true;
  pagina = 0;
  paginaActiva = 0;
  numeroPaginas = new Array(1);
  previus = false;
  next = true;
  setTimeRef: any;
  @ViewChild('closebutton') closebutton: any;
  constructor(
    private store: Store,
    private rolService: RolService,
    private alertService: AlertService,
    private formService: FormsService
  ) {
    this.rolForm = formService.crearFormularioRol();
    this.liatarForm = formService.crearFormularioListar();
  }

  ngOnInit(): void {
    this.fetchRoles();
  }
  ngOnDestroy(): void {
    clearTimeout(this.setTimeRef);
  }

  fetchRoles() {
    this.store.select(RolesState.getRolesList).subscribe((rolesList: Rol[]) => {
      this.roles = rolesList;
      this.numeroPaginas = new Array(Math.ceil(this.roles.length / 10));
      this.setTimeRef = setTimeout(() => (this.cargando = false), 450);
    });
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
    this.next = this.pagina + 10 < this.roles.length ? true : false;
    this.paginaActiva = nPagina;
  }
  nextPage() {
    if (this.roles.length > this.pagina) {
      this.pagina += 10;
      this.paginaActiva += 1;
      this.previus = true;
      this.next = this.pagina + 10 < this.roles.length ? true : false;
    }
  }

  limitar() {
    this.updateRoles();
  }
  agregarRol() {
    this.rolForm.reset();
    this.action = 'Agregar';
    this.submitType = 'Guardar';
  }

  get nombreNoValido() {
    return (
      this.rolForm.get('nombre')?.invalid && this.rolForm.get('nombre')?.touched
    );
  }
  get descripcionNoValida() {
    return (
      this.rolForm.get('descripcion')?.invalid &&
      this.rolForm.get('descripcion')?.touched
    );
  }
  onCloseForm() {
    this.closebutton.nativeElement.click();
  }
  guardarRol() {
    if (this.rolForm.invalid) {
      return Object.values(this.rolForm.controls).forEach((contr) => {
        if (contr instanceof FormGroup) {
          Object.values(contr.controls).forEach((contr) =>
            contr.markAllAsTouched()
          );
        } else {
          contr.markAsTouched();
        }
      });
    }

    const rol: Rol = {
      id: this.idRol,
      nombre: this.rolForm.value.nombre,
      descripcion: this.rolForm.value.descripcion,
    };
    if (this.action == 'Agregar') {
      this.rolService.ingresarRol(rol).subscribe((resp) => {
        if (resp.exito) {
          this.alertService
            .correcto(resp.data.nombre, resp.message)
            .then(() => {
              this.closebutton.nativeElement.click();
            });
          this.store.dispatch(new SetRol(resp?.data));
        } else {
          this.alertService.error('Error', resp.message);
        }
      });
    } else {
      this.rolService.actualizarRol(rol).subscribe((resp) => {
        if (resp.exito) {
          this.alertService
            .correcto(resp.data.nombre, resp.message)
            .then(() => {
              this.closebutton.nativeElement.click();
            });
          this.store.dispatch(new SetRol(resp?.data));
        } else {
          this.alertService.error('Error', resp.message);
        }
      });
    }
  }
  search() {
    if (this.liatarForm.value.columna != '') {
      this.updateRoles();
    }
  }
  updateRoles() {
    var listar: Listar = {
      columna: this.liatarForm.value.columna,
      search: this.liatarForm.value.search,
      offset: this.liatarForm.value.offset,
      limit: this.liatarForm.value.limit,
      sort: this.liatarForm.value.sort,
    };
    this.rolService.obtenerRoles(listar).subscribe((resp) => {
      this.roles = resp;
      this.numeroPaginas = new Array(Math.ceil(this.roles.length / 10));
      this.cargando = false;
    });
  }

  editarRol(rol: Rol) {
    this.action = 'Editar';
    this.submitType = 'Actualizar';
    this.idRol = rol?.id;
    this.rol = rol;
    this.rolForm.patchValue({
      nombre: rol.nombre,
      descripcion: rol.descripcion,
    });
  }

  eliminar(rol: Rol) {
    if (rol.id != null) {
      Swal.fire({
        position: 'center',
        icon: 'question',
        title: 'Esta seguro que desea borrar a',
        text: `${rol.nombre}`,
        showConfirmButton: true,
        showCancelButton: true,
      }).then((resp) => {
        if (resp.value) {
          this.rolService.eliminarRol(rol.id).subscribe((resp) => {
            if (resp.exito) {
              this.alertService.correcto('', resp.message).then(() => {});
              this.store.dispatch(new RemoveRol(resp?.id));
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
      columna: this.liatarForm.value.columna,
      search: this.liatarForm.value.search,
      offset: this.liatarForm.value.offset,
      limit: this.liatarForm.value.limit,
      sort: this.liatarForm.value.sort,
    };
    this.rolService.exportarExcel(listar).subscribe((blob) => {
      let fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl);
    });
  }
}
