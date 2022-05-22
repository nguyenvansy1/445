import { Component, OnInit } from '@angular/core';
import {User} from '../../../models/entity/user';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../../service/user.service';
import {ToastrService} from 'ngx-toastr';
import {TokenStorageService} from '../../../service/token-storage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  customer: User;
  isLoggedIn: boolean;
  constructor(private http: HttpClient,
              private userService: UserService,
              private toastr: ToastrService,
              private router: Router,
              private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
  }

  getInformationUser() {

  }

  checkLogin(){
    this.customer = this.tokenStorageService.getUser();
    if (this.customer != null) {

    }else{
      this.router.navigate(['/login']);
    }
  }
}
