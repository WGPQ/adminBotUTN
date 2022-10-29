import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticateComponent } from './auth/authenticate/authenticate.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ChangePassworkComponent } from './pages/change-passwork/change-passwork.component';
import { ChatBlogComponent } from './pages/chat-blog/chat-blog.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IntentsComponent } from './pages/intents/intents.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { PagesComponent } from './pages/pages.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { PhracesComponent } from './pages/phraces/phraces.component';
import { RolesComponent } from './pages/roles/roles.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';

const routes: Routes = [
  {
    path: 'dashboard', component: PagesComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'perfil', component: PerfilComponent },
      { path: 'usuarios/:rol', component: UsuariosComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'fraces', component: PhracesComponent },
      { path: 'intenciones', component: IntentsComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ]
  },
  { path: 'authenticate', component: AuthenticateComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'confirmar', component: ChangePassworkComponent },
  { path: 'chat-blog', component: ChatBlogComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
