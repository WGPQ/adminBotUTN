import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Listar } from 'src/app/interfaces/listar.interface';
import { Rol } from 'src/app/interfaces/rol.interface';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { RolService } from 'src/app/services/rol.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {
  usuario!: Usuario;
  cargando = false;
  usuarioForm!: FormGroup;
  roles: Rol[] = [];
  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) {
    this.cargando = true;
    this.listarRoles();
  }

  ngOnInit(): void {
    this.getPorfil();
  }
  getPorfil() {
    this.usuarioService.obtenerUsuario().subscribe(resp => {
      this.usuario = resp;
      // this.usuarioForm.patchValue({
      //   nombres: resp.nombres,
      //   apellidos: resp.apellidos,
      //   telefono: resp.telefono,
      //   correo: resp.correo,
      // });
      this.cargando = false;
    });
  }
  listarRoles() {
    const listar: Listar = {
      columna: "",
      search: "",
      offset: 0,
      limit: '100',
      sort: ""
    }
    this.rolService.obtenerRoles(listar).subscribe((resp) => {
      this.roles = resp;
    });
  }
}
