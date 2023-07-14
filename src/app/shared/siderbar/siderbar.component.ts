import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Modulo } from 'src/app/interfaces/modulo.intrface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { ModulosService } from 'src/app/services/modulos.service';
import { SetAccountState } from 'src/app/store/Account/account.state';

@Component({
  selector: 'app-siderbar',
  templateUrl: './siderbar.component.html',
  styles: [],
})
export class SiderbarComponent implements OnInit {
  modulos: Modulo[] = [];

  constructor(
    private store: Store,
    private router: Router,
    private modulosService: ModulosService
  ) {}

  ngOnInit(): void {
    this.listarModulos();
  }

  getUsers(rol?: string) {
    if (rol != null) {
      this.router.navigate(['dashboard/cuentas/' + rol]);
    }
  }
  listarModulos() {
    this.store
      .select(SetAccountState.getAccount)
      .subscribe((user?: Usuario) => {
        if (user?.id) {
          this.modulos = this.modulosService.getModulos(user!.rol!);
        }
      });
  }
}
