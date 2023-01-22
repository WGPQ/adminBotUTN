import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Login } from '../interfaces/login.interface';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as crypto from 'crypto-js';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuarios.interface';
import { Store } from '@ngxs/store';
import { SetAccount, SetAccountBlog } from '../store/Account/account.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  appUrl = environment.baseUrl;
  apiUrl = environment.apiLogin;
  secret = environment.secret;
  access_token!: string;
  session!: string;
  access_token_blog!: string;
  session_blog!: string;
  idUserRol!: string;
  usuario!: Usuario;

  private hubConnection: signalR.HubConnection | undefined;
  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.hubConnectionURL)
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));
  };

  public addTransferChartDataListener = () => {
    this.hubConnection!.on('transferchartdata', (data) => {
      console.log(data);
    });
  };

  private sharedObj = new Subject<any>();
  constructor(
    private http: HttpClient,
    private router: Router,
    private alertService: AlertService,
    private store: Store
  ) {
    this.leerToken();
    this.leerIdUserRol();
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + this.leerToken(),
    }),
  };

  //   private mapReceivedMessage(user: string, message: string): void {
  //     // this.receivedMessageObject.user = user;
  //     // this.receivedMessageObject.msgText = message;
  //     // this.sharedObj.next(this.receivedMessageObject);
  //  }
  // public retrieveMappedObject(): Observable<any> {
  //   return this.sharedObj.asObservable();
  // }

  // Strart the connection
  //  public async start() {
  //   try {
  //     await this.connection.start();
  //     console.log("connected");
  //   } catch (err) {
  //     console.log(err);
  //     setTimeout(() => this.start(), 5000);
  //   }
  // }
  acceso(login: Login): Observable<boolean> {
    return this.http
      .post(this.appUrl + this.apiUrl + '/login/portal', login)
      .pipe(
        map((resp: any) => {
          if (resp?.exito) {
            this.guardarToken(resp.token);
            this.guardarSession(resp.id_session);
          } else {
            this.alertService.error('', resp.message);
          }
          return resp.exito;
        }),
        catchError(this.errorHandler)
      );
  }


  acceso_chat_blog(correo: string): Observable<boolean> {
    return this.http
      .post(this.appUrl + this.apiUrl + '/login/chatbot', { correo })
      .pipe(
        map((resp: any) => {
          if (resp.exito) {
            this.guardarTokenBlog(resp.token);
            this.guardarSessionBlog(resp.id_session);
          } else {
            this.alertService.error('', resp.message);
          }
          return resp.exito;
        }),
        catchError(this.errorHandler)
      );
  }

  cerrarSesion() {
    var session_id = this.leerSession();
    this.logout(session_id).subscribe((resp) => {
      if (resp.exito) {
        this.access_token = '';
        sessionStorage.removeItem('acces-token');
        sessionStorage.removeItem('user-key');
        this.router.navigate(['/login']);
      }
    });
  }

  resetearClave(id?: string): Observable<any> {
    return this.http.get(
      this.appUrl + this.apiUrl + '/resetear/' + id,
      this.httpOptions
    );
  }

  actualizarClave(clave?: string, token?: string): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    });
    let data = {
      clave: clave,
    };
    return this.http.post(this.appUrl + this.apiUrl + '/actualizar', data, {
      headers: headers,
    });
  }
  logout(session?: string): Observable<any> {
    return this.http.get(this.appUrl + this.apiUrl + '/logout/' + session, {
      headers: { "Authorization": 'Bearer ' + this.leerToken() },
    });
  }

  guardarSession(session: string) {
    this.session = session;
    sessionStorage.setItem('session', session);
  }
  guardarToken(token: string) {
    this.access_token = token;
    sessionStorage.setItem('acces-token', token);
  }
  guardarSessionBlog(session: string) {
    this.session_blog = session;
    sessionStorage.setItem('session-blog', session);
  }
  guardarTokenBlog(token: string) {
    this.access_token_blog = token;
    sessionStorage.setItem('acces-token-blog', token);
  }

  guardarIdUserRol(id: string) {
    this.idUserRol = crypto.AES.encrypt(id.toString(), this.secret).toString();
    sessionStorage.setItem('user-key', this.idUserRol);
  }
  actualizarUsuario(usuario: Usuario) {
    console.log(usuario);
    this.usuario = usuario;
  }

  leerSession() {
    if (sessionStorage.getItem('session')) {
      this.session = sessionStorage.getItem('session') as string;
    } else {
      this.session = '';
    }
    return this.session;
  }
  leerToken() {
    if (sessionStorage.getItem('acces-token')) {
      this.access_token = sessionStorage.getItem('acces-token') as string;
    } else {
      this.access_token = '';
    }
    return this.access_token;
  }
  leerSessionBlog() {
    if (sessionStorage.getItem('session-blog')) {
      this.session = sessionStorage.getItem('session-blog') as string;
    } else {
      this.session = '';
    }
    return this.session;
  }
  leerTokenBlog() {
    if (sessionStorage.getItem('acces-token-blog')) {
      this.access_token = sessionStorage.getItem('acces-token-blog') as string;
    } else {
      this.access_token = '';
    }
    return this.access_token;
  }

  leerIdUserRol() {
    if (sessionStorage.getItem('user-key')) {
      this.idUserRol = sessionStorage.getItem('user-key') as string;
    } else {
      this.idUserRol = '';
    }
    return this.idUserRol;
  }

  estaAutenticado(): boolean {
    return this.access_token.length > 2;
  }
  estaAutenticadoBlog(): boolean {
    return this.access_token_blog.length > 2;
  }

  errorHandler(error: HttpErrorResponse) {
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      //console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      //console.error(`Backend returned code ${error.status}, ` +`body was: ${error.error}`);
      //this.alertService.error('error.statusText','error.message');
    }
    // return an observable with a user-facing error message
    return throwError(error.error);
  }

  verificarToken(): Observable<boolean> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + this.leerToken(),
    });
    return this.http
      .get(this.appUrl + this.apiUrl + '/verificar/token', { headers: headers })
      .pipe(
        map((resp: any) => {
          if (resp?.exito) {
            this.guardarToken(resp?.data?.token);
            const {
              id,
              nombres,
              apellidos,
              nombre_completo,
              telefono,
              correo,
              id_rol,
              rol,
              activo,
              verificado,
            } = resp?.data?.usuario;
            this.guardarIdUserRol(id);
            this.usuario = new Usuario(
              id,
              nombres,
              apellidos,
              nombre_completo,
              correo,
              telefono,
              '',
              id_rol,
              rol,
              activo,
              verificado
            );
            this.store.dispatch(new SetAccount(this.usuario));
          } else {
            this.alertService.error('', resp?.message);
          }
          return true;
        }),
        catchError((error) => {
          console.log(error);
          return of(false);
        })
      );
  }
  verificarTokenBlog(): Observable<boolean> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + this.leerTokenBlog(),
    });
    return this.http
      .get(this.appUrl + this.apiUrl + '/verificar/token', { headers: headers })
      .pipe(
        map((resp: any) => {
          if (resp?.exito) {
            this.guardarTokenBlog(resp?.data?.token);
            const {
              id,
              nombres,
              apellidos,
              nombre_completo,
              telefono,
              correo,
              id_rol,
              rol,
              activo,
              verificado,
            } = resp?.data?.usuario;
            this.usuario = new Usuario(
              id,
              nombres,
              apellidos,
              nombre_completo,
              correo,
              telefono,
              '',
              id_rol,
              rol,
              activo,
              verificado
            );
            this.store.dispatch(new SetAccountBlog(this.usuario));
          } else {
            this.alertService.error('', resp?.message);
          }
          return true;
        }),
        catchError((error) => {
          console.log(error);
          return of(false);
        })
      );
  }
}
