import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { Listar } from 'src/app/interfaces/listar.interface';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { ClienteService } from 'src/app/services/cliente.service';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {
  usuariosOnline: Usuario[] = [];
  clientes: Cliente[] = [];
  constructor(private usuarioService: UsuarioService,
    private clienteService: ClienteService
  ) { }


  ngOnInit(): void {
    this.getConectados(3);
    this.getClientes();
  }

  getConectados(rol: number) {
    this.usuarioService.usuarioEnLinea(rol).subscribe(resp => {
      this.usuariosOnline = resp;
    });
  }
  getClientes() {
    var listar: Listar = {
      columna: '',
      search: '',
      offset: 0,
      limit: 0,
      sort: '',
    }
    this.clienteService.obtenerClientes(listar).subscribe((resp) => {
      this.clientes = resp;
    });
  }


}
