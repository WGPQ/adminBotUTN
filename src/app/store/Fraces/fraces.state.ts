import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { RemoveFrace, SetFrace, SetFracesList } from './fraces.actions';
import { FracesStateModel } from './fraces.model';

@State<FracesStateModel>({
  name: 'fraces',
  defaults: {
    fracesList: [],
  },
})
@Injectable()
export class FracesState {
  @Selector()
  static getFracesList(state: FracesStateModel) {
    return state.fracesList;
  }

  @Action(SetFracesList)
  SetFraces(
    { getState, patchState }: StateContext<FracesStateModel>,
    { payload }: SetFracesList
  ) {
    patchState({
      fracesList: payload,
    });
  }
  @Action(SetFrace)
  AddFrace(
    { getState, patchState }: StateContext<FracesStateModel>,
    { payload }: SetFrace
  ) {
    const frace = payload;
    let fraces = [...getState().fracesList];
    const index = fraces.findIndex((f) => f?.id === frace?.id);
    if (index < 0) {
      fraces = [...fraces, frace];
    }
    if (index >= 0) {
      fraces[index] = frace;
    }

    patchState({
      fracesList: fraces,
    });
  }
  @Action(RemoveFrace)
  DeleteFrace(
    { getState, patchState }: StateContext<FracesStateModel>,
    { payload }: RemoveFrace
  ) {
    const id = payload;
    patchState({
      fracesList: getState().fracesList?.filter((f) => f?.id !== id),
    });
  }
}
