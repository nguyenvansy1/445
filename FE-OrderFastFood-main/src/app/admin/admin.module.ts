import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {AdminRoutingModule} from './admin-routing.module';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { OrderActionComponent } from './components/order/order-action/order-action.component';
import { OrderListComponent } from './components/order/order-list/order-list.component';
import { AdminProductAddComponent } from './components/products/admin-product-add/admin-product-add.component';
import { AdminProductDetailsComponent } from './components/products/admin-product-details/admin-product-details.component';
import { AdminProductListComponent } from './components/products/admin-product-list/admin-product-list.component';
import { AdminProductUpdateComponent } from './components/products/admin-product-update/admin-product-update.component';
import { CateDetailComponent } from './components/categories/cate-detail/cate-detail.component';
import { CateFormComponent } from './components/categories/cate-form/cate-form.component';
import { CateListComponent } from './components/categories/cate-list/cate-list.component';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {NgbPaginationModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';


@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    OrderActionComponent,
    OrderListComponent,
    AdminProductAddComponent,
    AdminProductDetailsComponent,
    AdminProductListComponent,
    AdminProductUpdateComponent,
    CateDetailComponent,
    CateFormComponent,
    CateListComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    NgbPaginationModule,
    FormsModule,
    NgbTooltipModule,
    MatTableModule,
    MatFormFieldModule
  ]
})
export class AdminModule { }
