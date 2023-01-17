import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetAccount } from './account.actions';
import { AccountStateModel } from './account.model';

@State<AccountStateModel>({
  name: 'account',
  defaults: {
    usuario: undefined,
  },
})
@Injectable()
export class SetAccountState {
  @Selector()
  static getAccount(state: AccountStateModel) {
    return state.usuario;
  }
  @Action(SetAccount)
  set(
    { getState, patchState }: StateContext<AccountStateModel>,
    { payload }: SetAccount
  ) {
    patchState({
      usuario: payload,
    });
  }
}
