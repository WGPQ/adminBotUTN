import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PostSolicitudes, RemoveSolicitud } from './solicitudes.actions';
import { SolicitudesStateModel } from './solicitudes.models';

@State<SolicitudesStateModel>({
  name: 'solicitudes',
  defaults: {
    solicitudes: [],
  },
})
@Injectable()
export class PostSolicitudesState {
  @Selector()
  static getSolicitudes(state: SolicitudesStateModel) {
    return state.solicitudes;
  }

  @Action(PostSolicitudes)
  post(
    { getState, patchState }: StateContext<SolicitudesStateModel>,
    { payload }: PostSolicitudes
  ) {
    const state = getState();
    patchState({
      solicitudes: state.solicitudes.concat(payload),
    });
  }

  @Action(RemoveSolicitud)
  remove(
    { getState, patchState }: StateContext<SolicitudesStateModel>,
    { payload }: RemoveSolicitud
  ) {
    patchState({
      solicitudes: getState().solicitudes.filter((s: any) => s?.id !== payload),
    });
  }
}
