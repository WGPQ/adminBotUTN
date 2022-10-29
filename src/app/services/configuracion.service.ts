import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Disponibilidad } from '../interfaces/disponibilidad.interface';
import { Listar } from '../interfaces/listar.interface';
import { AlertService } from './alert.service';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionService {
  appUrl = environment.baseUrl;
  apiConfig = environment.apiConfig;
  constructor(
    private http: HttpClient,
    private authservices: AuthenticationService,
    private alertService: AlertService
  ) {}

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.authservices.leerToken(),
  });

  // SERVICIO DISPONIBILIDAD
  obtenerDisponibilidades(listar: Listar): Observable<Disponibilidad[]> {
    const params = new HttpParams()
      .set('columna', listar.columna)
      .set('nombre', listar.search)
      .set('offset', listar.offset)
      .set('limit', listar.limit)
      .set('sort', listar.sort);
    return this.http
      .get(this.appUrl + this.apiConfig + '/Listar', {
        params: params,
        headers: this.headers,
      })
      .pipe(
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

  obtenerDisponibilidad(id?: string): Observable<Disponibilidad> {
    return this.http
      .get(this.appUrl + this.apiConfig + '/Obtener/' + id, {
        headers: this.headers,
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
  actualizarDisponibilidad(disp: Disponibilidad): Observable<any> {
    return this.http.post(this.appUrl + this.apiConfig + '/Actualizar', disp, {
      headers: this.headers,
    });
  }
}
