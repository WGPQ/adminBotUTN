import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { Listar } from 'src/app/interfaces/listar.interface';
import { Rol } from 'src/app/interfaces/rol.interface';
import { AlertService } from 'src/app/services/alert.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { FormsService } from 'src/app/services/forms.service';
import { RolService } from 'src/app/services/rol.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styles: [
  ]
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  clienteForm!: FormGroup;
  liatarForm!: FormGroup;
  submitType: string = "Guardar";
  action = "Agregar";
  idCliente?: string;
  cliente!: Cliente;
  cargando = false;
  rol!: string;
  @ViewChild('closebutton') closebutton: any;
  constructor(
    private clienteService: ClienteService,
    private alertService: AlertService,
    private formService: FormsService,
    private rolService: RolService,

  ) {
    this.cargando = true;
    this.clienteForm = formService.crearFormularioCliente();
    this.liatarForm = formService.crearFormularioListar();
  }

  ngOnInit(): void {
    this.listarRoles();
  }
  agregarRol() {
    this.clienteForm.reset();
    this.action = "Agregar"
    this.submitType = "Guardar";
  }
  listarRoles() {
    const listar: Listar = {
      columna: "",
      search: "",
      offset: 0,
      limit: 0,
      sort: ""
    }
    this.rolService.obtenerRoles(listar).subscribe((resp) => {
      resp.map((r) => r.nombre == "Cliente" ? this.rol = r.id! : "");
      if (this.rol != undefined) {

        this.listarClientes();
      }
    });
  }

  get nombresNoValido() {
    return this.clienteForm.get('nombres')?.invalid && this.clienteForm.get('nombres')?.touched;
  }
  get apellidosNoValido() {
    return this.clienteForm.get('apellidos')?.invalid && this.clienteForm.get('apellidos')?.touched;
  }
  get correoNoValido() {
    return this.clienteForm.get('correo')?.invalid && this.clienteForm.get('correo')?.touched;
  }
  onCloseForm() {
    this.closebutton.nativeElement.click();
  }
  guardarCliente() {
    if (this.clienteForm.invalid) {
      return Object.values(this.clienteForm.controls).forEach(contr => {
        if (contr instanceof FormGroup) {
          Object.values(contr.controls).forEach(contr => contr.markAllAsTouched());
        } else {
          contr.markAsTouched();
        }
      });
    }

    const cliente: Cliente = {
      id: this.idCliente,
      nombres: this.clienteForm.value.nombres,
      apellidos: this.clienteForm.value.apellidos,
      correo: this.clienteForm.value.correo,
      rol:this.rol,
    };
    if (this.action == 'Agregar') {
      this.clienteService.ingresarCliente(cliente).subscribe(resp => {
        if (resp.exito) {
          this.alertService.correcto(resp.data.nombre, resp.message).then(() => {
            this.closebutton.nativeElement.click();
            this.listarClientes();
          });
        } else {
          console.log('errorl');
          this.alertService.error('Error', resp.message);
        }
      });
    } else {
      this.clienteService.actualizarCliente(cliente).subscribe(resp => {
        if (resp.exito) {
          this.alertService.correcto(resp.data.nombre, resp.message).then(() => {
            this.closebutton.nativeElement.click();
            this.listarClientes();
          });
        } else {

          this.alertService.error('Error', resp.message);
        }

      });
    }


  }
  search() {
    if (this.liatarForm.value.columna != "") {
      this.listarClientes();
    }
  }
  listarClientes() {
    var listar: Listar = {
      columna: this.liatarForm.value.columna,
      search: this.liatarForm.value.search,
      offset: this.liatarForm.value.offset,
      limit: this.liatarForm.value.limit,
      sort: this.liatarForm.value.sort,
    }
    console.log(this.rol);
    
    this.clienteService.obtenerClientes(this.rol, listar).subscribe((resp) => {
      this.clientes = resp;
      this.cargando = false;
    });
  }

  editarCliente(id?: string) {
    this.action = "Editar"
    this.submitType = "Actualizar";
    this.idCliente = id;
    this.clienteService.obtenerCliente(id).subscribe(resp => {
      this.cliente = resp;
      this.clienteForm.patchValue({
        nombres: resp.nombres,
        apellidos: resp.apellidos,
        correo: resp.correo
      });
    });
  }

  eliminar(cliente: Cliente) {
    if (cliente.id != null) {
      Swal.fire({
        position: 'center',
        icon: 'question',
        title: 'Esta seguro que desea borrar a',
        text: `${cliente.nombre_completo}`,
        showConfirmButton: true,
        showCancelButton: true,
      }).then(resp => {
        if (resp.value) {

          this.clienteService.eliminarCliente(cliente.id).subscribe(resp => {
            if (resp.exito) {
              this.alertService.correcto('', resp.message).then(() => {
                this.listarClientes();
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
      columna: this.liatarForm.value.columna,
      search: this.liatarForm.value.search,
      offset: this.liatarForm.value.offset,
      limit: this.liatarForm.value.limit,
      sort: this.liatarForm.value.sort,
    }
    this.clienteService.exportarExcel(this.rol,listar).subscribe(blob => {
      let fileUrl = window.URL.createObjectURL(blob);
      window.open(fileUrl);
    });
  }


}
