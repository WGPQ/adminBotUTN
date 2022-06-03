import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Intencion } from '../interfaces/intencion.interface';
import { Listar } from '../interfaces/listar.interface';
import { AlertService } from './alert.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class IntencionService {

  appUrl = environment.baseUrl;
  apiIntencion = environment.apiIntencion;
  constructor(
    private http: HttpClient,
    private authservices: AuthenticationService,
    private alertService: AlertService) { }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.authservices.leerToken()
  });



  // SERVICIO INTENCION
  obtenerIntenciones(listar: Listar): Observable<Intencion[]> {
    const params = new HttpParams()
      .set("columna", listar.columna)
      .set("nombre", listar.search)
      .set("offset", listar.offset)
      .set("limit", listar.limit)
      .set("sort", listar.sort)
    return this.http.get(this.appUrl + this.apiIntencion + '/Listar', { headers: this.headers, params: params }).pipe(
      map((resp: any) => {
        if (resp.exito) {
          return resp.data;
        } else {
          this.alertService.error('Error ', resp.message);
          return [];
        }
      })
    );
  }

  obtenerIntencion(id?: string): Observable<Intencion> {
    return this.http.get(this.appUrl + this.apiIntencion + '/Obtener/' + id, { headers: this.headers }).pipe(
      map((resp: any) => {
        if (resp.exito) {
          return resp.data;
        } else {
          this.alertService.error('Error ', resp.message);
          return {};
        }
      })
    );
  }
  ingresarIntencion(intencion: Intencion): Observable<any> {
    return this.http.post(this.appUrl + this.apiIntencion + '/Insertar', intencion, { headers: this.headers });
  }
  eliminarIntencion(id?: string): Observable<any> {
    return this.http.delete(this.appUrl + this.apiIntencion + '/Eliminar/' + id, { headers: this.headers })
  }
  actualizarIntencion(intencion: Intencion): Observable<any> {
    return this.http.post(this.appUrl + this.apiIntencion + '/Actualizar', intencion, { headers: this.headers });
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
    return this.http.get(this.appUrl + this.apiIntencion + '/Exportar', { params: params, headers: headers, responseType: 'blob' });
  }
}
