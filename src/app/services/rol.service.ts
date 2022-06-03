import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Rol } from '../interfaces/rol.interface';
import { AlertService } from './alert.service';
import { map } from 'rxjs/operators'
import { Listar } from '../interfaces/listar.interface';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  appUrl = environment.baseUrl;
  apiRol = environment.apiRol;
  constructor(
    private http: HttpClient,
    private authservices: AuthenticationService,
    private alertService: AlertService
  ) { }


  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.authservices.leerToken()
  });



  //SERVICIOS ROL
  obtenerRoles(listar: Listar): Observable<Rol[]> {
    const params = new HttpParams()
      .set("columna", listar.columna)
      .set("nombre", listar.search)
      .set("offset", listar.offset)
      .set("limit", listar.limit)
      .set("sort", listar.sort)
    return this.http.get(this.appUrl + this.apiRol + '/Listar', { params: params, headers: this.headers }).pipe(
      map((resp: any) => {
        if (resp.exito) {
          return resp.data;
        } else {
          this.alertService.error('Error', resp.message);
          return [];
        }
      })
    )
  }
  obtenerRol(id?: string): Observable<Rol> {
    return this.http.get<Rol>(this.appUrl + this.apiRol + '/Obtener/' + id, { headers: this.headers }).pipe(
      map((resp: any) => {
        if (resp.exito) {
          return resp.data;
        } else {
          this.alertService.error('Error', resp.message);
          return [];
        }
      })
    )
  }
  ingresarRol(rol: Rol): Observable<any> {
    return this.http.post(this.appUrl + this.apiRol + '/Insertar', rol, { headers: this.headers });
  }
  eliminarRol(id?: string): Observable<any> {
    return this.http.delete(this.appUrl + this.apiRol + '/Eliminar/' + id, { headers: this.headers })
  }
  actualizarRol(rol: Rol): Observable<any> {
    return this.http.post(this.appUrl + this.apiRol + '/Actualizar', rol, { headers: this.headers });
  }

  
  exportarExcel(listar: Listar): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': "application/blob",
      'Authorization': 'Bearer ' + this.authservices.leerToken()
    })

    const params = new HttpParams()
      .set("columna", listar.columna)
      .set("nombre", listar.search)
      .set("offset", listar.offset)
      .set("limit", listar.limit)
      .set("sort", listar.sort)
    return this.http.get(this.appUrl + this.apiRol + '/Exportar', { params: params, headers: headers, responseType: 'blob' });

  }
}
