import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from './alert.service';
import { map } from 'rxjs/operators'
import { Listar } from '../interfaces/listar.interface';
import { AuthenticationService } from './authentication.service';
import { Cliente } from '../interfaces/cliente.interface';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  appUrl = environment.baseUrl;
  apiCliente = environment.apiUsuario;
  constructor(
    private http: HttpClient,
    private authservices: AuthenticationService,
    private alertService: AlertService
  ) {

  }
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.authservices.leerToken()
  });


  //SERVICIOS CLIENTE
  obtenerClientes(rol: string, listar: Listar): Observable<Cliente[]> {
    const params = new HttpParams()
      .set("rol", rol)
      .set("columna", listar.columna)
      .set("nombre", listar.search)
      .set("offset", listar.offset ?? null)
      .set("limit", listar.limit)
      .set("sort", listar.sort)
    console.log(rol);

    return this.http.get(this.appUrl + this.apiCliente + '/Listar', { params: params, headers: this.headers }).pipe(
      map((resp: any) => {
        // console.log(resp);

        if (resp.exito) {
          return resp.data;
        } else {
          this.alertService.error('Error', resp.message);
          return [];
        }
      })
    )
  }
  obtenerCliente(id?: string): Observable<Cliente> {
    return this.http.get<Cliente>(this.appUrl + this.apiCliente + '/Obtener/' + id, { headers: this.headers }).pipe(
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
  ingresarCliente(cliente: Cliente): Observable<any> {
    console.log(cliente);

    return this.http.post(this.appUrl + this.apiCliente + '/Insertar', cliente, { headers: this.headers });
  }
  eliminarCliente(id?: string): Observable<any> {
    return this.http.delete(this.appUrl + this.apiCliente + '/Eliminar/' + id, { headers: this.headers })
  }
  actualizarCliente(rol: Cliente): Observable<any> {
    return this.http.post(this.appUrl + this.apiCliente + '/Actualizar', rol, { headers: this.headers });
  }


  exportarExcel(rol: string, listar: Listar): Observable<any> {
    var headers = new HttpHeaders({
      'Content-Type': "application/blob",
      'Authorization': 'Bearer ' + this.authservices.leerToken()
    })

    const params = new HttpParams()
      .set("rol", rol)
      .set("columna", listar.columna)
      .set("nombre", listar.search)
      .set("offset", listar.offset)
      .set("limit", listar.limit)
      .set("sort", listar.sort)
    return this.http.get(this.appUrl + this.apiCliente + '/Exportar', { params: params, headers: headers, responseType: 'blob' });

  }
}
