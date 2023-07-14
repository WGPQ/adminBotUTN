import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import {
  RemoveAccount,
  RemoveAccountBlog,
  SetAccount,
  SetAccountBlog,
  SetBotPortal,
} from './account.actions';
import { AccountStateModel } from './account.model';

@State<AccountStateModel>({
  name: 'account',
  defaults: {
    usuario: undefined,
    usuarioBlog: undefined,
    bot: undefined,
  },
})
@Injectable()
export class SetAccountState {
  @Selector()
  static getAccount(state: AccountStateModel) {
    return state.usuario;
  }
  @Selector()
  static getAccountBlog(state: AccountStateModel) {
    return state.usuarioBlog;
  }
  @Selector()
  static getBot(state: AccountStateModel) {
    return state.bot;
  }
  @Action(SetAccount)
  SetAccountPortal(
    { getState, patchState }: StateContext<AccountStateModel>,
    { payload }: SetAccount
  ) {
    patchState({
      usuario: payload,
    });
  }
  @Action(SetBotPortal)
  SetBot(
    { getState, patchState }: StateContext<AccountStateModel>,
    { payload }: SetBotPortal
  ) {
    patchState({
      bot: payload,
    });
  }
  @Action(SetAccountBlog)
  SetAccountBog(
    { getState, patchState }: StateContext<AccountStateModel>,
    { payload }: SetAccountBlog
  ) {
    patchState({
      usuarioBlog: payload,
    });
  }
  @Action(RemoveAccount)
  RemoveAccount(
    { getState, patchState }: StateContext<AccountStateModel>,
    { payload }: RemoveAccount
  ) {
    patchState({
      usuario: payload,
    });
  }
  @Action(RemoveAccountBlog)
  RemoveAccountBog(
    { getState, patchState }: StateContext<AccountStateModel>,
    { payload }: RemoveAccountBlog
  ) {
    patchState({
      usuarioBlog: payload,
    });
  }
}
