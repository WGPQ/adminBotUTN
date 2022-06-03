import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MensageModel } from '../interfaces/mensaje.interface';

@Injectable({
  providedIn: 'root'
})
export class BibliotecaService {

  appUrl = environment.baseUrl;
  constructor(
    private http: HttpClient,
  ) { }


  checkConnection() {
    return this.http.get(this.appUrl).pipe(
      catchError(this.errorHandler)
    );
  }

  errorHandler(error: HttpErrorResponse) {

    console.log(error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      //console.error('An error occurred:', error.error.message);
      console.log('paso por aqui');


    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      //console.error(`Backend returned code ${error.status}, ` +`body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      error.error);
  }




  
  enviarMensaje() {

  }

  private mensajes: MensageModel[] = [
    // {
    //   id: '1',
    //   time: '10:01',
    //   user: 'Jose Puma',
    //   sms: 'https://utneduec-my.sharepoint.com/personal/wgpumaq_utn_edu_ec/_layouts/15/onedrive.aspx/hdshdjshd/.co'
    // },
    // {
    //   id: '2',
    //   time: '10:01',
    //   user: 'Asistente',
    //   sms: 'Hola como estas quiero que me ayudes'
    // },
    // {
    //   id: '1',
    //   time: '10:01',
    //   user: 'Jose Puma',
    //   sms: 'Hola como estas quiero que me ayudes'
    // },
    // {
    //   id: '2',
    //   time: '10:01',
    //   user: 'Asistente',
    //   sms: 'Hola como estas quiero que me ayudes'
    // },
    // {
    //   id: '1',
    //   time: '10:01',
    //   user: 'Jose Puma',
    //   sms: 'Hola como estas quiero que me ayudes'
    // },
    // {
    //   id: '2',
    //   time: '10:01',
    //   user: 'Asistente',
    //   sms: 'Hola como estas quiero que me ayudes'
    // },
    // {
    //   id: '1',
    //   time: '10:01',
    //   user: 'Jose Puma',
    //   sms: 'Hola como estas quiero que me ayudes'
    // },
    // {
    //   id: '2',
    //   time: '10:01',
    //   user: 'Asistente',
    //   sms: 'Hola como estas quiero que me ayudes'
    // }
  ];


  listarHostorialMensajes(): MensageModel[] {
    return this.mensajes;
  }
}
