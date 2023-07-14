// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  secret: "BIBLIOBOTUNIVERSIDADTENICADELNORTEIBARRA",
  baseUrl: "https://bibliochatservice02.azurewebsites.net",
  hubConnectionURL: 'https://bibliochatservice02.azurewebsites.net/session',
  // baseUrl: "http://localhost:44399",
  // hubConnectionURL: 'http://localhost:44399/session',
  apiRol: "/api/rol",
  apiConfig: "/api/disponibilidad",
  apiUsuario: "/api/usuario",
  apiLogin: "/api/auth",
  apiIntencion: "/api/intencion",
  apiFrace: "/api/frace",
  apiChat: "/api/chat",
  id_bot: "Q7sBHWzaXz8lsD2iiTR_cw"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
