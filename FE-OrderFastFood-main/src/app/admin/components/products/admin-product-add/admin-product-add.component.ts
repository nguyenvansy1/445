import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ProductCategory} from '../../../../models/entity/product-category';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ProductService} from '../../../../service/product.service';
import {ProductCategoryService} from '../../../../service/product-category.service';
import { Location } from '@angular/common';
import {Product} from '../../../../models/entity/product';
import {FormValidator} from '../../../validator/form-validator';
import {DialogComponent} from '../../../../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-admin-product-add',
  templateUrl: './admin-product-add.component.html',
  styleUrls: ['./admin-product-add.component.css']
})
export class AdminProductAddComponent implements OnInit {
  @ViewChild('myinputFirst') myinputFirst: ElementRef;
  @ViewChild('myinputLast') myinputLast: ElementRef;
  submitted = false;
  addProductFormGroup: FormGroup;
  productCategory: ProductCategory[] = [];

  url: any;

  constructor(private renderer: Renderer2,
              private formBuilder: FormBuilder,
              private productCategoryService: ProductCategoryService,
              public dialog: MatDialog,
              private route: Router,
              private productService: ProductService,
              private location: Location ) { }


  ngOnInit(): void {
    this.addProductFormGroup = this.formBuilder.group(
      {
        name: new FormControl('', [Validators.required, Validators.minLength(2),
          FormValidator.notOnlyWhitespace, Validators.maxLength(255)] ),
        description: new FormControl('', [Validators.maxLength(255)]),
        unitPrice: new FormControl('', [Validators.required, Validators.min(0)]),
        active: new FormControl(true),
        unitInStock: new FormControl('', [Validators.required, Validators.min(0)]),
        category: new FormControl('', FormValidator.DefaultOption),
      },
    );

    this.addProductFormGroup.get('category').setValue('Default');
    this.productCategoryService.getAllProductCategory().subscribe(
      data => {
        this.productCategory = data;
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

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit() {
    this.myinputFirst.nativeElement.focus();
    // this.renderer.removeClass( this.myinputFirst, 'ng-invalid');
  }

  get name() { return this.addProductFormGroup.get('name'); }
  get description() { return this.addProductFormGroup.get('description'); }
  get active() { return this.addProductFormGroup.get('active'); }
  get unitPrice() { return this.addProductFormGroup.get('unitPrice'); }
  get unitInStock() { return this.addProductFormGroup.get('unitInStock'); }
  get category() { return this.addProductFormGroup.get('category'); }
  get form() { return this.addProductFormGroup.controls; }

  onSubmit() {
    this.submitted = true;
    console.log('Handle Form Submit');
    if (this.addProductFormGroup.invalid) {
      this.addProductFormGroup.markAllAsTouched();
      return;
    }
    console.log(this.addProductFormGroup.value);
    this.openDialog1('Do you want to add product?', 'Yes', 'No');
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
    this.productService.saveProduct(product).subscribe(
      {
        next: response => {
          this.openDialog('Added successfully', 'Back to list', 'Continue');
        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );

  }

  readUrl(event) {
    if (event.target.files) {
      const reader = new FileReader();
      reader.onload = (e : any) => {
        this.url = e.target.result;
        console.log(this.url);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }


  openDialog(message: string, textConfirm: string, textCancel: string) {
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
        // this.route.navigateByUrl('admin/products');
        this.route.navigate(['admin/products'], { queryParams: { new: 1 } });
      }else{
        this.submitted = false;
        this.addProductFormGroup.reset();
        this.addProductFormGroup.get('category').setValue('Default');
      }
    });
  }

  reset(event: any){
    event.preventDefault();
    this.addProductFormGroup.reset();
    this.addProductFormGroup.get('category').setValue('Default');

  }

  enableSubmited(){
    this.submitted = true;
  }

  backClicked() {
    this.location.back();
  }

}

