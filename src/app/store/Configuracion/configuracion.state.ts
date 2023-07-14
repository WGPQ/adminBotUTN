import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  SetConfiguracion,
  SetConfiguracionList,
} from './configuracion.actions';
import { ConfiguracionStateModel } from './configuracion.model';

@State<ConfiguracionStateModel>({
  name: 'configuracion',
  defaults: {
    configuracionList: [],
  },
})
@Injectable()
export class ConfiguracionState {
  @Selector()
  static getDisponibilidadList(state: ConfiguracionStateModel) {
    return state.configuracionList;
  }

  @Action(SetConfiguracionList)
  SetConfiguracion(
    { getState, patchState }: StateContext<ConfiguracionStateModel>,
    { payload }: SetConfiguracionList
  ) {
    patchState({
      configuracionList: payload,
    });
  }
  @Action(SetConfiguracion)
  UpdateConfiguracion(
    { getState, patchState }: StateContext<ConfiguracionStateModel>,
    { payload }: SetConfiguracion
  ) {
    const configuracion = payload;
    let configuraciones = [...getState().configuracionList];
    const index = configuraciones.findIndex((c) => c?.id === configuracion?.id);
    if (index >= 0) {
      configuraciones[index] = configuracion;
    }

    patchState({
      configuracionList: configuraciones,
    });
  }
}
