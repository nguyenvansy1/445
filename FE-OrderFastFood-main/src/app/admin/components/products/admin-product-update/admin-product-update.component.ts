import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Product} from '../../../../models/entity/product';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductCategory} from '../../../../models/entity/product-category';
import {FormValidator} from '../../../validator/form-validator';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductCategoryService} from '../../../../service/product-category.service';
import {ProductService} from '../../../../service/product.service';
import {MatDialog} from '@angular/material/dialog';
import { Location } from '@angular/common';
import {DialogComponent} from '../../../../shared/components/dialog/dialog.component';
import {DialogRedirectComponent} from '../../../../shared/components/dialog-redirect/dialog-redirect.component';

@Component({
  selector: 'app-admin-product-update',
  templateUrl: './admin-product-update.component.html',
  styleUrls: ['./admin-product-update.component.css']
})
export class AdminProductUpdateComponent implements OnInit {
  product: Product;
  @ViewChild('myinputFirst') myinputFirst: ElementRef;
  @ViewChild('myinputLast') myinputLast: ElementRef;

  submitted = true;
  url: string;
  addProductFormGroup: FormGroup;
  productCategory: ProductCategory[] = [];

  constructor(private formBuilder: FormBuilder,
              private routerActive: ActivatedRoute,
              private productCategoryService: ProductCategoryService,
              public dialog: MatDialog, private route: Router,
              private productService: ProductService,
              private location: Location  ) { }



  ngOnInit(): void {

    this.addProductFormGroup = this.formBuilder.group(
      {
        name: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.notOnlyWhitespace] ),
        description: new FormControl('', [Validators.maxLength(255)]),
        unitPrice: new FormControl('', [Validators.required, Validators.min(0)]),
        active: new FormControl(true),
        unitInStock: new FormControl('', [Validators.required, Validators.min(0)]),
        category: new FormControl('', FormValidator.DefaultOption),
      },
    );


    this.routerActive.paramMap.subscribe(() => {
      this.getProduct();
    });

  }

  getProduct(){

    const productId: number = +this.routerActive.snapshot.paramMap.get('id');

    this.productService.getProductById(productId).subscribe({
      next: response => {
        this.product = response;

        this.setFormValue();

      },
      error: err => {
        alert(`There was an error: ${err.message}`);
      }
    });
  }

  setFormValue(){
    console.log(this.unitPrice) ;

    this.addProductFormGroup.setValue({
      name: this.product.name,
      description: this.product.description,
      unitPrice: this.product.unitPrice,
      active: this.product.active,
      unitInStock: this.product.unitInStock,
      category: this.product.category

    });

    this.url = this.product.imageUrl;

    this.productCategoryService.getAllProductCategory().subscribe(
      data => {
        this.productCategory = data;
        console.log(this.productCategory);

        this.addProductFormGroup.get('category').setValue(this.productCategory[0]);
      }
    );

  }

  onShiftKey(event: KeyboardEvent) {

    event.preventDefault();
    if (event.shiftKey && event.key === 'Tab') {
      this.myinputLast.nativeElement.focus();

    }
  }

  onKey(event: KeyboardEvent) {

    event.preventDefault();
    if (event.key === 'Tab') {
      this.myinputFirst.nativeElement.focus();
    }
  }


  ngAfterViewInit() {
    this.myinputFirst.nativeElement.focus();
  }

  get name() { return this.addProductFormGroup.get('name'); }
  get description() { return this.addProductFormGroup.get('description'); }
  get active() { return this.addProductFormGroup.get('active'); }
  get unitPrice() { return this.addProductFormGroup.get('unitPrice'); }
  get unitInStock() { return this.addProductFormGroup.get('unitInStock'); }
  get category() { return this.addProductFormGroup.get('category'); }

  onSubmit() {
    console.log('Handle Form Submit');
    this.submitted = true;
    if (this.addProductFormGroup.invalid) {
      return;
    }
    console.log(this.addProductFormGroup.value);
    this.openDialog1('Do you want to update product?', 'Yes', 'No');
  }


  openDialog1(message: string, textConfirm: string, textCancel: string) {
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
        this.saveProduct();
      }
    });

  }

  saveProduct(){
    const product = new Product();
    console.log(product);
    product.name = this.addProductFormGroup.get('name').value;
    product.description = this.addProductFormGroup.get('description').value;
    product.active = true;
    product.unitPrice = this.addProductFormGroup.get('unitPrice').value;
    product.unitInStock = this.addProductFormGroup.get('unitInStock').value;

    product.imageUrl = this.url;
    const productCategory = new ProductCategory();

    productCategory.id = this.addProductFormGroup.get('category').value.id;

    product.category = productCategory;


    this.productService.updateProduct(product, +this.product.id).subscribe(
      {
        next: response => {
          this.openDialog2('Updated successfully ', 'Back to list');

        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );

  }

  openDialog2(message: string, textConfirm: string) {
    const dialogRef = this.dialog.open(DialogRedirectComponent, {
      data: {
        message,
        buttonText: {
          ok: textConfirm,
        }
      }
    });


    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.route.navigateByUrl('admin/products');
      }else{
        this.addProductFormGroup.reset();
        this.addProductFormGroup.get('category').setValue('Default');
      }
    });

  }


  readUrl(event) {
    if (event.target.files) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
        console.log(this.url);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }


  reset(event){

    event.preventDefault();

    this.addProductFormGroup.reset();

    this.addProductFormGroup.get('category').setValue('Default');

  }

  backClicked() {
    this.location.back();
  }

  enableSubmitted(){
    this.submitted = true;
  }

}
