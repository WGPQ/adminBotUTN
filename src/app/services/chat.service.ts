import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Listar } from '../interfaces/listar.interface';
import { AlertService } from './alert.service';
import { Interaction } from '../interfaces/interaction.interface';
import { MensageModel } from '../interfaces/mensaje.interface';
import { AuthenticationService } from './authentication.service';
import { SendChat } from '../interfaces/sendchat.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  //id_bot yYIn_EQQo-GTSSOoUqjtgQ
  appUrl = environment.baseUrl;
  apiChat = environment.apiChat;
  idBot = environment.id_bot;
  constructor(
    private http: HttpClient,
    private authservices: AuthenticationService,
    private alertService: AlertService
  ) {}
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization:
      'Bearer ' +
      (this.authservices.leerToken() || this.authservices.leerTokenBlog()),
  });

  //Listar interacciones
  getInteractios(listar: Listar): Observable<any> {
    const params = new HttpParams()
      .set('columna', listar.columna)
      .set('nombre', listar.search)
      .set('offset', listar.offset)
      .set('limit', listar.limit)
      .set('sort', listar.sort);
    return this.http
      .get(this.appUrl + this.apiChat + '/interaccion' + '/Listar', {
        headers: this.headers,
        params: params,
      })
      .pipe(map((resp: any) => this.crearArregloInteracciones(resp.data)));
  }

  //Listar interacciones
  getSessiones(id?: string, listar?: Listar): Observable<any> {
    const params = new HttpParams()
      .set('usuario', id!)
      .set('columna', listar!.columna)
      .set('nombre', listar!.search)
      .set('offset', listar!.offset)
      .set('limit', listar!.limit)
      .set('sort', listar!.sort);
    return this.http
      .get(this.appUrl + this.apiChat + '/sesiones' + '/Listar', {
        headers: this.headers,
        params: params,
      })
      .pipe(
        map((resp: any) => {
          if (resp.exito) {
            return resp.data;
          }
          return [];
        })
      );
  }
  //Listar interacciones
  getComentarios(listar: Listar): Observable<any> {
    const params = new HttpParams()
      .set('columna', listar.columna)
      .set('nombre', listar.search)
      .set('offset', listar.offset)
      .set('limit', listar.limit)
      .set('sort', listar.sort);
    return this.http
      .get(this.appUrl + this.apiChat + '/comentarios/Listar', {
        headers: this.headers,
        params: params,
      })
      .pipe(
        map((resp: any) => {
          if (resp.exito) {
            return resp.data;
          }
          return [];
        })
      );
  }

  getChat(idSession: string): Observable<any> {
    const params = new HttpParams().set('session', idSession);
    return this.http
      .get(this.appUrl + this.apiChat + '/mensajes' + '/Session', {
        headers: this.headers,
        params: params,
      })
      .pipe(
        map((resp: any) => {
          if (resp.exito) {
            return resp?.data?.map((m: any) => m?.result);
          }
          return [];
        })
      );
  }
  getSolicitudes(anio: string, meses: string, listar: Listar): Observable<any> {
    const params = new HttpParams()
      .set('anio', anio)
      .set('meses', meses)
      .set('columna', listar.columna)
      .set('nombre', listar.search)
      .set('offset', listar.offset ?? null)
      .set('limit', listar.limit)
      .set('sort', listar.sort);

    return this.http
      .get(this.appUrl + this.apiChat + '/solicitudes/listar', {
        params: params,
        headers: this.headers,
      })
      .pipe(
        map((resp: any) => {
          if (resp.exito) {
            return resp.data;
          } else {
            this.alertService.error('Error', resp.message);
            return [];
          }
        })
      );
  }

  private crearArregloInteracciones(interactionsObj: any) {
    const interactions: Interaction[] = [];

    if (interactionsObj === null) {
      return [];
    }

    Object.keys(interactionsObj).forEach((key) => {
      const interaction: Interaction = interactionsObj[key]['result'];

      if (Object.keys(interaction.lastMessage).length > 0) {
        interactions.push(interaction);
      }
    });

    return interactions;
  }

  getMessages(idChat: string, listar: Listar): Observable<any> {
    return this.http
      .post(
        this.appUrl + this.apiChat + '/mensaje/' + idChat + '/Listar',
        listar,
        { headers: this.headers }
      )
      .pipe(map((resp: any) => this.crearArregloMensajes(resp.data)));
  }

  private crearArregloMensajes(mensajesObj: any) {
    const mensajes: MensageModel[] = [];

    if (mensajesObj === null) {
      return [];
    }

    Object.keys(mensajesObj).forEach((key) => {
      const mensaje: MensageModel = mensajesObj[key]['result'];
      mensajes.push(mensaje);
    });
    return mensajes;
  }

  newMessage(mensaje: MensageModel): Observable<any> {
    const newMessage = {
      chat: mensaje.chat,
      // "usuario": this.authservices.usuario.id,
      usuario: this.idBot,
      contenido: mensaje.contenido,
      createdAt: new Date().toISOString(),
    };
    return this.http.post(
      this.appUrl + this.apiChat + '/mensaje/crear',
      newMessage,
      { headers: this.headers }
    );
  }
  senComentario(data: object, token: string): Observable<any> {
    return this.http.post(
      this.appUrl + this.apiChat + '/comentario/crear',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }
  sendChat(sendChat: SendChat, token: string): Observable<any> {
    return this.http.post(this.appUrl + this.apiChat + '/send/Chat', sendChat, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
  }

  calificarChat(sessionId: string, calificacion: number, token: string) {
    return this.http.post(
      this.appUrl + this.apiChat + '/calificacion/crear',
      {
        sessionId,
        calificacion,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      }
    );
  }
  aceptarSolicitud(
    solicitudId: string,
    usuarioId: string,
    accion: boolean
  ): Observable<any> {
    return this.http.post(
      this.appUrl + this.apiChat + '/solicitud/reaccionar',
      {
        id: solicitudId,
        reaccion: usuarioId,
        accion: accion,
      },
      { headers: this.headers }
    );
  }
}
