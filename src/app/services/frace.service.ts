import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Frace } from '../interfaces/frace.interface';
import { Listar } from '../interfaces/listar.interface';
import { AlertService } from './alert.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class FraceService {

  appUrl = environment.baseUrl;
  apiFrace = environment.apiFrace;

  constructor(
    private http: HttpClient,
    private authservices: AuthenticationService,
    private alertService: AlertService) { }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.authservices.leerToken()
  });


  // SERVICIO FRACES
  obtenerFraces(listar: Listar): Observable<Frace[]> {
    const params = new HttpParams()
      .set("columna", listar.columna)
      .set("nombre", listar.search)
      .set("offset", listar.offset)
      .set("limit", listar.limit)
      .set("sort", listar.sort)
    return this.http.get(this.appUrl + this.apiFrace + '/Listar', { params: params, headers: this.headers }).pipe(
      map((resp: any) => {
        if (resp.exito) {
          return resp.data;
        } else {
          this.alertService.error('Error', resp.message);
          console.log(resp.message);

          return [];
        }
      })
    );
  }

  obtenerFrace(id?: string): Observable<Frace> {
    return this.http.get(this.appUrl + this.apiFrace + '/Obtener/' + id, { headers: this.headers }).pipe(
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
  ingresarFrace(frace: Frace): Observable<any> {
    return this.http.post(this.appUrl + this.apiFrace + '/Insertar', frace, { headers: this.headers });
  }
  eliminarFrace(id?: string): Observable<any> {
    return this.http.delete(this.appUrl + this.apiFrace + '/Eliminar/' + id, { headers: this.headers })
  }
  actualizarFrace(frace: Frace): Observable<any> {
    return this.http.post(this.appUrl + this.apiFrace + '/Actualizar', frace, { headers: this.headers });
  }


  exportarExcel(codigo: string, listar: Listar): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': "application/blob",
      'Authorization': 'Bearer ' + this.authservices.leerToken()
    })

    const params = new HttpParams()
      .set("codigo", codigo)
      .set("columna", listar.columna)
      .set("nombre", listar.search)
      .set("offset", listar.offset)
      .set("limit", listar.limit)
      .set("sort", listar.sort)
    return this.http.get(this.appUrl + this.apiFrace + '/Exportar', { params: params, headers: headers, responseType: 'blob' });

  }

}
