import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {ProductsComponent} from './components/products/products.component';
import {ProfileComponent} from './components/profile/profile.component';
import {BoardUserComponent} from './components/board-user/board-user.component';
import {ItemDetailComponent} from './components/item-detail/item-detail.component';
import {CartComponent} from './components/cart/cart.component';
import {OrderHistoryComponent} from './components/order-history/order-history.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {CommonModule} from '@angular/common';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {VerificationComponent} from './components/verification/verification.component';
import {VerifiResetPasswordComponent} from './components/verifi-reset-password/verifi-reset-password.component';
import {RateComponent} from './components/rate/rate.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      {path: '', component: ProductsComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'user', component: BoardUserComponent},
      {path: 'carts', component: CartComponent },
      {path: 'item-detail/:id', component: ItemDetailComponent },
      {path: 'order-history', component: OrderHistoryComponent },
      {path: 'profile', component: UserProfileComponent },
    ]
  }
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class GuestRoutingModule { }
