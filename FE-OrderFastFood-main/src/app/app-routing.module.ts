import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './shared/login/login.component';
import {RegisterComponent} from './shared/register/register.component';
import {ErrorPageComponent} from './shared/components/error-page/error-page.component';
import {HomeComponent} from './guest/components/home/home.component';
import {ResetPasswordComponent} from './guest/components/reset-password/reset-password.component';
import {VerifiResetPasswordComponent} from './guest/components/verifi-reset-password/verifi-reset-password.component';
import {VerificationComponent} from './guest/components/verification/verification.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forget-password', component: ResetPasswordComponent},
  {path: 'verify-reset-password', component: VerifiResetPasswordComponent},
  {path: 'verification', component: VerificationComponent},
  {path: '', redirectTo: 'home-page', pathMatch: 'full'},
  // {path: '**', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
