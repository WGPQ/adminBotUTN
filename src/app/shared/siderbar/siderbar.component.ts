import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Listar } from 'src/app/interfaces/listar.interface';
import { Modulo } from 'src/app/interfaces/modulo.intrface';
import { Rol } from 'src/app/interfaces/rol.interface';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { RolService } from 'src/app/services/rol.service';

@Component({
  selector: 'app-siderbar',
  templateUrl: './siderbar.component.html',
  styles: []
})
export class SiderbarComponent implements OnInit {
  roles: Rol[] = [];
  modulos: Modulo[] = [];


  constructor(
    private rolService: RolService,
    private modulosService: ModulosService,
    private authservices: AuthenticationService,
    private router: Router) {
    this.listarModulos(this.authservices.usuario.rol);
  }

  ngOnInit(): void {
    this.listarRoles();
  }

  getUsers(rol?: string) {

    if (rol != null) {
      
      this.router.navigate(['dashboard/usuarios/' + rol]);
    }
  }
  listarModulos(rol: string) {
    this.rolService.obtenerRol(rol).subscribe((resp: Rol) => {
      this.modulos = this.modulosService.getModulos(resp.nombre);
    });
  }
  listarRoles() {
    const listar: Listar = {
      columna: "",
      search: "",
      offset: 0,
      limit: 100,
      sort: ""
    }
    this.rolService.obtenerRoles(listar).subscribe((resp: Rol[]) => {
      this.roles = resp.slice(0, 3);
    });
  }
}
