import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  constructor(
    private authservices: AuthenticationService
    , private router: Router) { }

  ngOnInit(): void {
    if (!this.authservices.usuario.verificado) {
      this.router.navigate(['/login']);
    }
  }

}
