import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {HomeComponent} from './components/home/home.component';
import {AdminProductListComponent} from './components/products/admin-product-list/admin-product-list.component';
import {AdminProductAddComponent} from './components/products/admin-product-add/admin-product-add.component';
import {AdminProductUpdateComponent} from './components/products/admin-product-update/admin-product-update.component';
import {AdminProductDetailsComponent} from './components/products/admin-product-details/admin-product-details.component';
import {CateFormComponent} from './components/categories/cate-form/cate-form.component';
import {CateListComponent} from './components/categories/cate-list/cate-list.component';
import {OrderListComponent} from './components/order/order-list/order-list.component';
import {UserProfileComponent} from '../guest/components/user-profile/user-profile.component';
import {AuthGuardService} from '../service/AuthGuardService';
import {Role} from '../common/Role';
import {JWT_OPTIONS, JwtHelperService} from '@auth0/angular-jwt';

const routes: Routes = [
  {
    path: 'admin', component: DashboardComponent,
    // canActivate: [AuthGuardService],
    // data: { expectedRole: Role.Admin},
    children: [
      {path: 'home', component: HomeComponent},
      {path: 'profile', component: UserProfileComponent},
      {path: 'products', children : [
          {path: '', component: AdminProductListComponent},
          {path: 'create', component: AdminProductAddComponent},
          {path: 'detail/:id', component: AdminProductDetailsComponent},
          {path: 'update/:id', component: AdminProductUpdateComponent},
          {path: 'delete/:id', component: AdminProductListComponent},
          {path: 'search', component: AdminProductListComponent},
          {path: 'sort/:sortBy', component: AdminProductListComponent},
        ]},
      {
        path: 'product-category', children : [
          {path: '', component: CateListComponent},
          {path: 'create', component: CateFormComponent},
          {path: 'update/:id', component: CateFormComponent},
          {path: 'detail/:id', component: CateFormComponent},
        ]
      },
      {
        path: 'order', children : [
          {path: '', component: OrderListComponent}
        ]
      },
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  providers: [ {provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
  JwtHelperService],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
