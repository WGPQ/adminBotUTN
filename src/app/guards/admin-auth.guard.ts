import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngxs/store';
import { Usuario } from '../interfaces/usuario.interface';
import { SetAccountState } from '../store/Account/account.state';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  usuario!: Usuario;
  constructor(private store: Store) {
    this.store.select(SetAccountState.getAccount).subscribe((user) => {
      this.usuario = user!;
    });
  }
  canActivate(): boolean {
    return this.usuario.rol === 'Administrador';
  }
}
