import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import {
  PostSolicitudes,
  RemoveSolicitud,
  SetChatActual,
  SetComentarios,
  SetInteracciones,
  SetMessagesByChat,
  SetSessiones,
  SetUsuarioChat,
  UpdateShowNotification,
  UpdateSolicitud,
} from './chat.actions';
import { ChatStateModel } from './chat.model';

@State<ChatStateModel>({
  name: 'chat',
  defaults: {
    chatActual: {
      id: '',
      nombre: '',
      solicitante: '',
      reaccion: '',
      session: '',
      conversationId: '',
      action: '',
      createAt: '',
      messages: [],
    },
    sesiones: [],
    comentarios: [],
    chatMessages: [],
    solicitudes: [],
    interacciones: null,
    mostarNotificacion: false,
    anios: ['2024', '2025', '2026', '2027', '2028', '2030'],
    meses: [
      { id: 1, nombre: 'Enero', shorName: 'Ene', show: true },
      { id: 2, nombre: 'Febrero', shorName: 'Feb', show: true },
      { id: 3, nombre: 'Marzo', shorName: 'Mar', show: true },
      { id: 4, nombre: 'Abril', shorName: 'Abr', show: true },
      { id: 5, nombre: 'Mayo', shorName: 'May', show: true },
      { id: 6, nombre: 'Junio', shorName: 'Jun', show: true },
      { id: 7, nombre: 'Julio', shorName: 'Jul', show: true },
      { id: 8, nombre: 'Agosto', shorName: 'Ago', show: true },
      { id: 9, nombre: 'Septiembre', shorName: 'Sep', show: true },
      { id: 10, nombre: 'Octubre', shorName: 'Oct', show: true },
      { id: 11, nombre: 'Noviembre', shorName: 'Nov', show: true },
      { id: 12, nombre: 'Diciembre', shorName: 'Dic', show: true },
    ],
    usuarioChat: undefined,
  },
})
@Injectable()
export class ChatState {
  @Selector()
  static getChatActual(state: ChatStateModel) {
    return state.chatActual;
  }

  @Selector()
  static getComentarios(state: ChatStateModel) {
    return state.comentarios;
  }
  @Selector()
  static getMessagesConversation(state: ChatStateModel) {
    const chat = state.chatActual;
    const solicitudes = state.solicitudes;
    const solicitud = solicitudes?.find((soli) => soli?.id == chat?.id);
    return solicitud?.messages || [];
  }

  @Selector()
  static getSolicitudes(state: ChatStateModel) {
    return state.solicitudes;
  }

  @Selector()
  static getInteracciones(state: ChatStateModel) {
    return state.interacciones;
  }

  @Selector()
  static showNotification(state: ChatStateModel) {
    return state.mostarNotificacion;
  }
  @Selector()
  static getAnios(state: ChatStateModel) {
    return state.anios;
  }
  @Selector()
  static getSessiones(state: ChatStateModel) {
    return state.sesiones;
  }
  @Selector()
  static getMeses(state: ChatStateModel) {
    return state.meses;
  }

  @Action(SetInteracciones)
  SetInteracciones(
    { getState, patchState }: StateContext<ChatStateModel>,
    { payload }: SetInteracciones
  ) {
    const { list, bot } = payload;
    const meses = getState().meses;
    let botArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let agenteArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (const interacion of list) {
      const mes = new Date(interacion?.createdAt).getMonth() + 1;
      const indiceMes = meses?.findIndex((m) => m?.id == mes);
      if (indiceMes != -1) {
        if (interacion?.reaccion == bot?.id) {
          botArray[indiceMes]++;
        } else {
          agenteArray[indiceMes]++;
        }
      }
    }
    const interactionObj = { bot: botArray, agente: agenteArray };

    patchState({
      interacciones: interactionObj,
    });
  }
  @Action(SetSessiones)
  SetSessiones(
    { getState, patchState }: StateContext<ChatStateModel>,
    { payload }: SetSessiones
  ) {
    let califiones = [0, 1, 2, 3];
    const array = payload || [];
    for (const score of array) {
      if (score?.calificacion == null) {
        califiones[3]++;
      } else {
        califiones[score.calificacion]++;
      }
    }
    patchState({
      sesiones: califiones,
    });
  }
  @Action(SetComentarios)
  SetComentarios(
    { getState, patchState }: StateContext<ChatStateModel>,
    { payload }: SetComentarios
  ) {
    patchState({
      comentarios: payload,
    });
  }
  @Action(SetUsuarioChat)
  SetUsuarioChat(
    { getState, patchState }: StateContext<ChatStateModel>,
    { payload }: SetUsuarioChat
  ) {
    patchState({
      usuarioChat: payload,
    });
  }
  @Action(SetChatActual)
  SetCurrentChat(
    { getState, patchState }: StateContext<ChatStateModel>,
    { payload }: SetChatActual
  ) {
    patchState({
      chatActual: payload,
    });
  }

  @Action(PostSolicitudes)
  SetSolicitudes(
    { getState, patchState }: StateContext<ChatStateModel>,
    { payload }: PostSolicitudes
  ) {
    const state = getState();
    patchState({
      solicitudes: state.solicitudes.concat(payload),
    });
  }
  @Action(SetMessagesByChat)
  PostMessagesByChat(
    { getState, patchState }: StateContext<ChatStateModel>,
    { payload }: SetMessagesByChat
  ) {
    const { chatId, activity } = payload;
    const solicitudes = getState().solicitudes;
    const chats = solicitudes?.map((solicitud) => {
      if (solicitud?.id == chatId) {
        let solicitudChat = { ...solicitud };
        solicitudChat.messages = [...solicitudChat.messages, activity];
        return solicitud;
      }
      return solicitud;
    });

    patchState({
      solicitudes: chats,
    });
  }

  @Action(UpdateSolicitud)
  UpdateSolicitud(
    { getState, patchState }: StateContext<ChatStateModel>,
    { payload }: UpdateSolicitud
  ) {
    patchState({
      solicitudes: getState().solicitudes.map((s: any) => {
        if (payload?.id === s?.id) return payload;
        return s;
      }),
    });
  }

  @Action(RemoveSolicitud)
  RemoveSolicitud(
    { getState, patchState }: StateContext<ChatStateModel>,
    { payload }: RemoveSolicitud
  ) {
    patchState({
      solicitudes: getState().solicitudes.filter((s: any) => s?.id !== payload),
    });
  }

  @Action(UpdateShowNotification)
  UpdateShowNotification(
    { getState, patchState }: StateContext<ChatStateModel>,
    { payload }: UpdateShowNotification
  ) {
    patchState({
      mostarNotificacion: payload,
    });
  }
}
