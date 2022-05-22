import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {GuestRoutingModule} from './guest-routing.module';
import {ToastrModule} from 'ngx-toastr';
import { CartComponent } from './components/cart/cart.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { BoardUserComponent } from './components/board-user/board-user.component';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { ProductsComponent } from './components/products/products.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RateComponent } from './components/rate/rate.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbPaginationModule, NgbRatingModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormDirective} from '../admin/directive/form.directive';
import {MatOptionModule} from '@angular/material/core';
import { VerificationComponent } from './components/verification/verification.component';
import { VerifiResetPasswordComponent } from './components/verifi-reset-password/verifi-reset-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import {MatButtonModule} from '@angular/material/button';



@NgModule({
  declarations: [
    CartComponent,
    HeaderComponent,
    HomeComponent,
    BoardUserComponent,
    ItemDetailComponent,
    OrderDetailComponent,
    OrderHistoryComponent,
    ProductsComponent,
    ProfileComponent,
    RateComponent,
    UserProfileComponent,
    FormDirective,
    VerificationComponent,
    VerifiResetPasswordComponent,
    ResetPasswordComponent,
  ],
    imports: [
        CommonModule,
        ToastrModule.forRoot({
            timeOut: 2500,
            // progressBar: true,
            progressAnimation: 'increasing',
            // preventDuplicates: true,
            closeButton: true,
            // newestOnTop: false,
        }),
        SharedModule,
        GuestRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NgbRatingModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        NgbTooltipModule,
        NgbPaginationModule,
        MatOptionModule,
        MatButtonModule
    ]
})
export class GuestModule { }
