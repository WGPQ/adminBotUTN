import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { RemoveUsuario, SetUsuario, SetUsuariosList } from './usuarios.actions';
import { UsuariosStateModel } from './usuarios.model';

@State<UsuariosStateModel>({
  name: 'usuarios',
  defaults: {
    usuariosList: [],
  },
})
@Injectable()
export class UsuariosState {
  @Selector()
  static getUsuariosList(state: UsuariosStateModel) {
    return state.usuariosList;
  }

  @Action(SetUsuariosList)
  SetUsers(
    { getState, patchState }: StateContext<UsuariosStateModel>,
    { payload }: SetUsuariosList
  ) {
    patchState({
      usuariosList: payload,
    });
  }
  @Action(SetUsuario)
  SetUser(
    { getState, patchState }: StateContext<UsuariosStateModel>,
    { payload }: SetUsuario
  ) {
    const user = payload;
    let usuarios = [...getState().usuariosList];
    const index = usuarios.findIndex((u) => u?.id === user?.id);
    if (index < 0) {
      usuarios = [...usuarios, user];
    }
    if (index >= 0) {
      usuarios[index] = user;
    }

    patchState({
      usuariosList: usuarios,
    });
  }
  @Action(RemoveUsuario)
  DeleteUser(
    { getState, patchState }: StateContext<UsuariosStateModel>,
    { payload }: RemoveUsuario
  ) {
    const id = payload;
    patchState({
      usuariosList: getState().usuariosList?.filter((u) => u?.id !== id),
    });
  }
}
