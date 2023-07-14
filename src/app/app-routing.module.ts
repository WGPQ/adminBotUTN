import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { ChangePassworkComponent } from './pages/change-passwork/change-passwork.component';
import { ChatBlogComponent } from './pages/chat-blog/chat-blog.component';
import { ChatComponent } from './pages/chat/chat.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IntentsComponent } from './pages/intents/intents.component';
import { PagesComponent } from './pages/pages.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { PhracesComponent } from './pages/phraces/phraces.component';
import { RolesComponent } from './pages/roles/roles.component';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { ResetpasswordComponent } from './auth/resetpassword/resetpassword.component';
import { ExampleBlogComponent } from './pages/example-blog/example-blog.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'perfil', component: PerfilComponent },
      {
        path: 'cuentas/:rol',
        component: AccountsComponent,
        canActivate: [AdminAuthGuard],
      },
      {
        path: 'roles',
        component: RolesComponent,
        canActivate: [AdminAuthGuard],
      },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'chat', component: ChatComponent },
      {
        path: 'frases',
        component: PhracesComponent,
        canActivate: [AdminAuthGuard],
      },
      {
        path: 'intenciones',
        component: IntentsComponent,
        canActivate: [AdminAuthGuard],
      },
      {
        path: 'configuracion',
        component: ConfiguracionComponent,
      },
      { path: '**', redirectTo: '/', pathMatch: 'full' },
    ],
  },

  { path: 'login', component: LoginComponent },
  { path: 'resetear', component: ResetpasswordComponent },
  { path: 'confirmar', component: ChangePassworkComponent },
  { path: 'chat-blog', component: ChatBlogComponent },
  { path: 'bliboteca-utn', component: ExampleBlogComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
