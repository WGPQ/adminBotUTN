import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Listar } from 'src/app/interfaces/listar.interface';
import { Rol } from 'src/app/interfaces/rol.interface';
import { RolService } from 'src/app/services/rol.service';

@Component({
  selector: 'app-siderbar',
  templateUrl: './siderbar.component.html',
  styles: []
})
export class SiderbarComponent implements OnInit {
  roles: Rol[] = [];

  constructor(
    private rolService: RolService,
    private router: Router) { }

  ngOnInit(): void {
    this.listarRoles();
  }

  getUsers(rol?: string) {
    
    if (rol != null) {
      this.router.navigate(['dashboard/usuarios/' + rol]);
     
    }
  }
  listarRoles() {
    const listar: Listar = {
      columna: "",
      search: "",
      offset: 0,
      limit: 100,
      sort: ""
    }
    this.rolService.obtenerRoles(listar).subscribe((resp) => {
      this.roles = resp;
    });
  }
}
