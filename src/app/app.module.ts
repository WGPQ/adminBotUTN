import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgxMaskModule, IConfig } from 'ngx-mask'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { HeaderComponent } from './shared/header/header.component';
import { SiderbarComponent } from './shared/siderbar/siderbar.component';
import { BreadcrumbsComponent } from './shared/breadcrumbs/breadcrumbs.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { PagesComponent } from './pages/pages.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ActivoPipe } from './pipes/activo.pipe';
import { RolPipe } from './pipes/rol.pipe';
import { IntencionPipe } from './pipes/intencion.pipe';
import { ChatComponent } from './pages/chat/chat.component';
import { RolesComponent } from './pages/roles/roles.component';
import { ChangePassworkComponent } from './pages/change-passwork/change-passwork.component';
import { IntentsComponent } from './pages/intents/intents.component';
import { PhracesComponent } from './pages/phraces/phraces.component';
import { FiltroPipe } from './pipes/filtro.pipe';
import { AuthenticateComponent } from './auth/authenticate/authenticate.component';
import { TextElipsisPipe } from './pipes/text-elipsis.pipe';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { BibliochatComponent } from './pages/bibliochat/bibliochat.component';
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
    BreadcrumbsComponent,
    NotfoundComponent,
    PagesComponent,
    UsuariosComponent,
    ActivoPipe,
    RolPipe,
    IntencionPipe,
    ChatComponent,
    RolesComponent,
    ChangePassworkComponent,
    IntentsComponent,
    PhracesComponent,
    FiltroPipe,
    AuthenticateComponent,
    TextElipsisPipe,
    ClientesComponent,
    BibliochatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(maskConfigFunction),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
