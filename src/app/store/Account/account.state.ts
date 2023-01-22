import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetAccount, SetAccountBlog } from './account.actions';
import { AccountStateModel } from './account.model';

@State<AccountStateModel>({
  name: 'account',
  defaults: {
    usuario: undefined,
    usuarioBlog:undefined,
  },
})
@Injectable()
export class SetAccountState {
  @Selector()
  static getAccount(state: AccountStateModel) {
    return state.usuario;
  }
  static getAccountBlog(state: AccountStateModel) {
    return state.usuarioBlog;
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
  @Action(SetAccountBlog)
  setBlog(
    { getState, patchState }: StateContext<AccountStateModel>,
    { payload }: SetAccountBlog
  ) {
    patchState({
      usuarioBlog: payload,
    });
  }
}
