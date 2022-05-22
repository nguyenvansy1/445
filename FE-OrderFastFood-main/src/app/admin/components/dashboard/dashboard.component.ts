import { Component, OnInit } from '@angular/core';
import {TokenStorageService} from '../../../service/token-storage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  username: string;
  constructor(private tokenStorageService: TokenStorageService,
              private route: Router) { }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.username = user.username;
    }else{
      this.route.navigateByUrl('login');
    }
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

}
