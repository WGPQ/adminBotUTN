import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styles: [
  ]
})
export class NotfoundComponent implements OnInit {

  constructor(
    private authservices: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
  }

  backPage() {
    if (this.authservices?.estaAutenticado()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
