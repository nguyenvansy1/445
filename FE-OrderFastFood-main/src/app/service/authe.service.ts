import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AutheService {

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  login(credentials): Observable<any>{
    return this.http.post(AUTH_API + 'signin', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  register(user): Observable<any>{
    return this.http.post(AUTH_API + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    }, httpOptions);
  }

  isUserLoggedIn() {
    const token = sessionStorage.getItem('auth-token');
    console.log(token);
    if (token) {
      // decode the token to get its payload
      const tokenPayload = this.jwtHelper.decodeToken(token);
      const user = tokenPayload.sub;
      // console.log(!(user === null))
      return !(user === null);
    }
    return false;
  }

  verifyPassword(code: string): Observable<any> {
    return this.http.post(AUTH_API + 'verify-password', {
      code
    }, httpOptions);
  }

  resetPassword(username: string): Observable<any> {
    return this.http.post(AUTH_API + 'reset-password', {
      username,
    }, httpOptions);
  }

  doResetPassword(password: string, code: string): Observable<any> {
    return this.http.post(AUTH_API + 'do-forget-password', {
      password,
      code
    }, httpOptions);
  }
}
