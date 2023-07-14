import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { environment } from 'src/environments/environment';

import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import {
  registerLocaleData,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';

import localEs from '@angular/common/locales/es';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { HeaderComponent } from './shared/header/header.component';
import { SiderbarComponent } from './shared/siderbar/siderbar.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { PagesComponent } from './pages/pages.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { ActivoPipe } from './pipes/activo.pipe';
import { RolPipe } from './pipes/rol.pipe';
import { IntencionPipe } from './pipes/intencion.pipe';
import { ChatComponent } from './pages/chat/chat.component';
import { RolesComponent } from './pages/roles/roles.component';
import { ChangePassworkComponent } from './pages/change-passwork/change-passwork.component';
import { IntentsComponent } from './pages/intents/intents.component';
import { PhracesComponent } from './pages/phraces/phraces.component';
import { FiltroPipe } from './pipes/filtro.pipe';
import { TextElipsisPipe } from './pipes/text-elipsis.pipe';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { BibliochatComponent } from './pages/bibliochat/bibliochat.component';
import { ChatBlogComponent } from './pages/chat-blog/chat-blog.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { SetAccountState } from './store/Account/account.state';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { RolesState } from './store/Roles/roles.state';
import { UsuariosState } from './store/Usuarios/usuarios.state';
import { FracesState } from './store/Fraces/fraces.state';
import { IntencionesState } from './store/Intenciones/intenciones.state';
import { ConfiguracionState } from './store/Configuracion/configuracion.state';
import { ChatState } from './store/Chat/chat.state';
import { CorreoToUserPipe } from './pipes/correo-to-user.pipe';
import { ResetpasswordComponent } from './auth/resetpassword/resetpassword.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { CalificacionesComponent } from './pages/calificaciones/calificaciones.component';
import { ExampleBlogComponent } from './pages/example-blog/example-blog.component';

registerLocaleData(localEs);
const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false,
  };
};

@NgModule({
  declarations: [
    AppComponent,
    PerfilComponent,
    DashboardComponent,
    LoginComponent,
    HeaderComponent,
    SiderbarComponent,
    NotfoundComponent,
    PagesComponent,
    AccountsComponent,
    ActivoPipe,
    RolPipe,
    IntencionPipe,
    ChatComponent,
    RolesComponent,
    ChangePassworkComponent,
    IntentsComponent,
    PhracesComponent,
    FiltroPipe,
    TextElipsisPipe,
    UsuariosComponent,
    BibliochatComponent,
    ChatBlogComponent,
    ConfiguracionComponent,
    TimeAgoPipe,
    CorreoToUserPipe,
    ResetpasswordComponent,
    SolicitudesComponent,
    CalificacionesComponent,
    ExampleBlogComponent,
  ],
  imports: [
    BrowserModule,
    NgChartsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(maskConfigFunction),
    NgxsModule.forRoot(
      [
        SetAccountState,
        RolesState,
        UsuariosState,
        IntencionesState,
        FracesState,
        ConfiguracionState,
        ChatState,
      ],
      {
        developmentMode: !environment.production,
      }
    ),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production,
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: true,
    }),
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'es',
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
