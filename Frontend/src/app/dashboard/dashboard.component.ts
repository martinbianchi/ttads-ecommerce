import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../guard-services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
  }
  
  logout():void {
    this.authService.logout();
  }

}
