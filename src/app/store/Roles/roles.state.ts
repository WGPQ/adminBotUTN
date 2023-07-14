import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { RemoveRol, SetRol, SetRolesList } from './roles.actions';
import { RolesStateModel } from './roles.model';

@State<RolesStateModel>({
  name: 'roles',
  defaults: {
    rolesList: [],
  },
})
@Injectable()
export class RolesState {
  @Selector()
  static getRolesList(state: RolesStateModel) {
    return state.rolesList;
  }

  @Action(SetRolesList)
  SetRoles(
    { getState, patchState }: StateContext<RolesStateModel>,
    { payload }: SetRolesList
  ) {
    patchState({
      rolesList: payload,
    });
  }
  @Action(SetRol)
  AddRol(
    { getState, patchState }: StateContext<RolesStateModel>,
    { payload }: SetRol
  ) {
    const rol = payload;
    let roles = [...getState().rolesList];
    const index = roles.findIndex((u) => u?.id === rol?.id);
    if (index < 0) {
      roles = [...roles, rol];
    }
    if (index >= 0) {
      roles[index] = rol;
    }

    patchState({
      rolesList: roles,
    });
  }
  @Action(RemoveRol)
  DeleteRol(
    { getState, patchState }: StateContext<RolesStateModel>,
    { payload }: RemoveRol
  ) {
    const id = payload;
    patchState({
      rolesList: getState().rolesList?.filter((r) => r?.id !== id),
    });
  }
}
