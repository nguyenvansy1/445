import { Component, OnInit } from '@angular/core';
import {Product} from '../../../../models/entity/product';
import { Location } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../../service/product.service';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from '../../../../shared/components/dialog/dialog.component';
import {DialogRedirectComponent} from '../../../../shared/components/dialog-redirect/dialog-redirect.component';

@Component({
  selector: 'app-admin-product-details',
  templateUrl: './admin-product-details.component.html',
  styleUrls: ['./admin-product-details.component.css']
})
export class AdminProductDetailsComponent implements OnInit {

  product: Product;

  constructor(public dialog: MatDialog,
              private routeActive: ActivatedRoute,
              private productService: ProductService,
              private route: Router,
              private location: Location) { }

  ngOnInit(): void {
    this.routeActive.paramMap.subscribe(() => {
      this.getProduct();
    });

  }

  getProduct(){
    const productId: number = +this.routeActive.snapshot.paramMap.get('id');
    this.productService.getProductById(productId).subscribe({
      next: response => {
        this.product = response;
      },
      error: err => {
        this.openDialogError('Error! Not found product', 'go to list', 'cancel');
      }
    });

  }

  Delete() {
    this.openDialog('Do you want to Delete product?', 'Yes', 'No', this.product.id);
  }

  openDialog(message: string, textConfirm: string, textCancel: string, id: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message,
        buttonText: {
          ok: textConfirm,
          cancel: textCancel
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteProduct(id);
      }
    });

  }

  deleteProduct(id: number){
    this.productService.deleteProduct(id).subscribe(
      (data) => {
        this.openDialogBack('Deleted successfully', 'Back to list');
      }, (error) => {
        console.log(error);
        this.openDialogError('Error! Not found product', 'go to list', 'cancel');
      }
    );
  }

  openDialogBack(message: string, textConfirm: string) {
    const dialogRef = this.dialog.open(DialogRedirectComponent, {
      data: {
        message,
        buttonText: {
          ok: textConfirm
        }
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.route.navigateByUrl('admin/products');
      }
    });
  }

  openDialogError(message: string, textConfirm: string, textCancel: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message,
        buttonText: {
          ok: textConfirm,
          cancel: textCancel
        }
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.route.navigateByUrl('admin/products');
      }
    });
  }

  backClicked() {
    this.location.back();
  }

}
