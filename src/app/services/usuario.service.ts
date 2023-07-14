import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as crypto from 'crypto-js';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Listar } from '../interfaces/listar.interface';
import { Usuario } from '../interfaces/usuario.interface';
import { AlertService } from './alert.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  appUrl = environment.baseUrl;
  apiUsuario = environment.apiUsuario;
  secret = environment.secret;
  constructor(
    private http: HttpClient,
    private authservices: AuthenticationService,
    private alertService: AlertService
  ) {}
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authservices.leerToken(),
  });
  // SERVICIO USUARIO
  obtenerUsuarios(rol?: any, listar?: Listar): Observable<Usuario[]> {
    const params = new HttpParams()
      .set('rol', rol || null)
      .set('columna', listar!.columna)
      .set('nombre', listar!.search)
      .set('offset', listar!.offset)
      .set('limit', listar!.limit)
      .set('sort', listar!.sort);
    return this.http
      .get(this.appUrl + this.apiUsuario + '/Listar', {
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

  obtenerUsuario(id?: string, token?: string): Observable<Usuario> {
    if (id == undefined) {
      var decrypted = crypto.AES.decrypt(
        this.authservices.leerIdUserRol(),
        this.secret
      );
      id = decrypted.toString(crypto.enc.Utf8);
    }

    return this.http
      .get(this.appUrl + this.apiUsuario + '/Obtener/' + id, {
        headers: token
          ? {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            }
          : this.headers,
      })
      .pipe(
        map((resp: any) => {
          if (resp.exito) {
            return resp.data;
          } else {
            this.alertService.error('Error', resp.message);
            return {};
          }
        })
      );
  }
  subirFotoCloudinary(data: any): Observable<any> {
    return this.http.post(
      'https://api.cloudinary.com/v1_1/dw9uf4st5/image/upload',
      data
    );
  }
  usuarioEnLinea(rol: number): Observable<Usuario[]> {
    const params = new HttpParams().set('rol', rol);
    return this.http
      .get(this.appUrl + this.apiUsuario + '/Linea', {
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

  ingresarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(
      this.appUrl + this.apiUsuario + '/Insertar',
      usuario,
      { headers: this.headers }
    );
  }
  eliminarUsuario(id?: string): Observable<any> {
    return this.http.delete(this.appUrl + this.apiUsuario + '/Eliminar/' + id, {
      headers: this.headers,
    });
  }
  actualizarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(
      this.appUrl + this.apiUsuario + '/Actualizar',
      usuario,
      { headers: this.headers }
    );
  }

  exportarExcel(rol: string, listar: Listar): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': 'application/blob',
      Authorization: 'Bearer ' + this.authservices.leerToken(),
    });

    const params = new HttpParams()
      .set('rol', rol)
      .set('columna', listar.columna)
      .set('nombre', listar.search)
      .set('offset', listar.offset)
      .set('limit', listar.limit)
      .set('sort', listar.sort);
    return this.http.get(this.appUrl + this.apiUsuario + '/Exportar', {
      params: params,
      headers: headers,
      responseType: 'blob',
    });
  }
}
