import { Component, OnInit, ViewChild } from '@angular/core';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { Store } from '@ngxs/store';
import { UsuariosState } from 'src/app/store/Usuarios/usuarios.state';
import { ChatState } from 'src/app/store/Chat/chat.state';
import { Comentario } from 'src/app/interfaces/comentarios.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit {
  usuariosOnline: Usuario[] = [];
  usuarios: Usuario[] = [];
  clientes: Cliente[] = [];
  comentarios: Comentario[] = [];
  rolOperador: string = 'Agente';
  rolCliente: string = 'Usuario';
  barChartLabels: string[] = [];
  chatsPerdidos: Number = 0;
  totalchatsAtendidos: Number = 0;

  constructor(private store: Store) {
    this.store
      .select(ChatState.getInteracciones)
      .subscribe((interacciones: any) => {
        if (interacciones) {
          const total = [...interacciones?.bot, ...interacciones?.agente];
          this.totalchatsAtendidos = total.reduce(
            (total: Number, item: any) => (total = total + item),
            0
          );
          const array = interacciones?.bot ?? [];
          this.chatsPerdidos = array.reduce(
            (resp: any, item: any) => (resp = resp + item),
            0
          );
        }
      });
  }

  ngOnInit(): void {
    this.getConectados();
    this.getClientes();
    this.getComentarios();
  }

  getConectados() {
    this.store
      .select(UsuariosState.getUsuariosList)
      .subscribe((usuariosList: Usuario[]) => {
        this.usuariosOnline = usuariosList.filter(
          (usuario) =>
            usuario.rol?.toLowerCase() === this.rolOperador.toLowerCase() &&
            usuario.conectado === true
        );
      });
  }
  getClientes() {
    this.store
      .select(UsuariosState.getUsuariosList)
      .subscribe((usuariosList: Usuario[]) => {
        this.clientes = usuariosList.filter(
          (usuario) =>
            usuario.rol?.toLowerCase() === this.rolCliente.toLowerCase()
        );

        this.usuarios = usuariosList.filter(
          (usuario) =>
            usuario.rol?.toLowerCase() === this.rolOperador.toLowerCase()
        );
      });
  }
  getInteracciones(anio: string, meses: string) {}

  getComentarios() {
    this.store
      .select(ChatState.getComentarios)
      .subscribe((comentariosList: Comentario[]) => {
        this.comentarios = comentariosList;
      });
  }
}
