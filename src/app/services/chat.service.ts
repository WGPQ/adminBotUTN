import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Listar } from '../interfaces/listar.interface';
import { AlertService } from './alert.service';
import { Interaction } from '../interfaces/interaction.interface';
import { MensageModel } from '../interfaces/mensaje.interface';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
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
  ) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authservices.leerToken()
    })
  }   

  //Listar interacciones
  getInteractios(listar: Listar): Observable<any> {   
    return this.http.post(this.appUrl + this.apiChat + '/interaccion' + "/Listar", listar, this.httpOptions).pipe(
      map((resp: any) => this.crearArregloInteracciones(resp.data))
    );
  }

  private crearArregloInteracciones(interactionsObj: any) {
    console.log(interactionsObj);
    const interactions: Interaction[] = [];

    if (interactionsObj === null) { return []; }

    Object.keys(interactionsObj).forEach((key) => {
      const interaction: Interaction = interactionsObj[key]['result'];

      if (Object.keys(interaction.chat).length > 0) {
        interactions.push(interaction);
      }
    });

    return interactions;
  }

  getMessages(idChat: string, listar: Listar): Observable<any> {
    return this.http.post(this.appUrl + this.apiChat + '/mensaje/' + idChat + "/Listar", listar, this.httpOptions).pipe(
      map((resp: any) => this.crearArregloMensajes(resp.data))
    );
  }

  private crearArregloMensajes(mensajesObj: any) {
    const mensajes: MensageModel[] = [];

    if (mensajesObj === null) { return []; }

    Object.keys(mensajesObj).forEach((key) => {
      const mensaje: MensageModel = mensajesObj[key]['result'];
      mensajes.push(mensaje);
    });
    return mensajes;
  }

  newMessage(mensaje: MensageModel): Observable<any> {
    const newMessage = {
      "chat": mensaje.chat,
      // "usuario": this.authservices.usuario.id,
      "usuario": this.idBot,
      "contenido": mensaje.contenido,
      "createdAt": new Date().toISOString()
    }
    return this.http.post(this.appUrl + this.apiChat + '/mensaje/crear', newMessage, this.httpOptions);

  }



}
