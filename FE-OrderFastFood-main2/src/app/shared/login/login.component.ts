import { Component, OnInit } from '@angular/core';
import {AutheService} from '../../service/authe.service';
import {TokenStorageService} from '../../service/token-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConstants} from '../../common/app.constants';
import {UserService} from '../../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  currentUser: any;
  roles: string[] = [];

  name = 'name';

  googleURL = AppConstants.GOOGLE_AUTH_URL;
  facebookURL = AppConstants.FACEBOOK_AUTH_URL;

  constructor(private authService: AutheService,
              private token: TokenStorageService,
              private route: ActivatedRoute,
              private tokenStorage: TokenStorageService,
              private userService: UserService,
              private router: Router) { }

  // ngOnInit(): void {
  //   if (this.token.getToken()) {
  //     this.isLoggedIn = true;
  //     this.roles = this.token.getUser().roles;
  //   }
  // }
  ngOnInit(): void {
    const token: string = this.route.snapshot.queryParamMap.get('token');
    console.log(token);
    const error: string = this.route.snapshot.queryParamMap.get('error');
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.currentUser = this.tokenStorage.getUser();
    } else if (token) {
      this.tokenStorage.saveToken(token);
      this.userService.getUserBoard().subscribe(
        data => {
          console.log(data);
          this.login(data);
        },
        err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      );
    } else if (error) {
      this.errorMessage = error;
      this.isLoginFailed = true;
    }
  }

  login(user): void {
    this.tokenStorage.saveUser(user);
    this.isLoginFailed = false;
    this.isLoggedIn = true;
    this.currentUser = this.tokenStorage.getUser();
    // window.location.reload();

  }

  onSubmit(): void{
    this.authService.login(this.form).subscribe(data => {
      this.token.saveToken(data.accessToken);
      console.log(data.accessToken);
      this.token.saveUser(data);
      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.roles = this.token.getUser().roles;
      this.reloadPage();
    }, error => {
      this.errorMessage = 'Thông tin đăng nhập không hợp lệ';
      this.isLoginFailed = true;
    });
  }

  logout() {
    this.token.signOut();
    window.location.reload();
  }

  reloadPage(): void {
    if (this.roles.includes('ROLE_ADMIN')){
      this.router.navigateByUrl('/admin');
      return;
    }

    if (this.roles.includes('ROLE_USER')){
      this.router.navigateByUrl('/');
      return;
    }
  }
}
