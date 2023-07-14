import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  RemoveIntencion,
  SetIntencion,
  SetIntencionesList,
} from './intenciones.actions';
import { IntencionesStateModel } from './intenciones.model';

@State<IntencionesStateModel>({
  name: 'intenciones',
  defaults: {
    intencionesList: [],
  },
})
@Injectable()
export class IntencionesState {
  @Selector()
  static getIntencionesList(state: IntencionesStateModel) {
    return state.intencionesList;
  }

  @Action(SetIntencionesList)
  SetIntenciones(
    { getState, patchState }: StateContext<IntencionesStateModel>,
    { payload }: SetIntencionesList
  ) {
    patchState({
      intencionesList: payload,
    });
  }
  @Action(SetIntencion)
  AddIntencion(
    { getState, patchState }: StateContext<IntencionesStateModel>,
    { payload }: SetIntencion
  ) {
    const intencion = payload;
    let intenciones = [...getState().intencionesList];
    const index = intenciones.findIndex((i) => i?.id === intencion?.id);
    if (index < 0) {
      intenciones = [...intenciones, intencion];
    }
    if (index >= 0) {
      intenciones[index] = intencion;
    }

    patchState({
      intencionesList: intenciones,
    });
  }
  @Action(RemoveIntencion)
  DeleteIntencion(
    { getState, patchState }: StateContext<IntencionesStateModel>,
    { payload }: RemoveIntencion
  ) {
    const id = payload;
    patchState({
      intencionesList: getState().intencionesList?.filter((i) => i?.id !== id),
    });
  }
}
