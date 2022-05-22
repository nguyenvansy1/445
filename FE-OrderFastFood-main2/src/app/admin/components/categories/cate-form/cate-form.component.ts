import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ProductCategory} from '../../../../models/entity/product-category';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {ProductCategoryService} from '../../../../service/product-category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Location} from '@angular/common';
import {DialogComponent} from '../../../../shared/components/dialog/dialog.component';
import {FormValidator} from '../../../validator/form-validator';

@Component({
  selector: 'app-cate-form',
  templateUrl: './cate-form.component.html',
  styleUrls: ['./cate-form.component.css']
})
export class CateFormComponent implements OnInit {

  formTitle: string;
  productCategory: ProductCategory;

  @ViewChild('myinputFirst') myinputFirst: ElementRef;

  @ViewChild('myinputLast') myinputLast: ElementRef;

  addProductCategoryFormGroup: FormGroup;
  submitted = false;

  mode = 1;

  constructor(private route: Router,
              private productCategoryService: ProductCategoryService,
              private formBuilder: FormBuilder,
              private location: Location,
              private routeActive: ActivatedRoute,
              public dialog: MatDialog, ) { }

  ngOnInit(): void {
    this.addProductCategoryFormGroup = this.formBuilder.group(
      {
        id: new FormControl(''),
        name: new FormControl('', [Validators.required, Validators.minLength(2), FormValidator.notOnlyWhitespace] ),
        description: new FormControl('', [Validators.maxLength(255)]),
      },
    );

    this.routeActive.paramMap.subscribe(() => {
      this.setMode();
    });
  }

  setMode(){
    if (this.routeActive.snapshot.paramMap.has('id')){
      this.formTitle = 'Cập nhật thể loại';
      const productCateId: number = +this.routeActive.snapshot.paramMap.get('id');
      this.productCategoryService.getProductCategoryById(productCateId).subscribe(
        {
          next: response => {
            this.productCategory = response;
            this.addProductCategoryFormGroup.setValue({
              id: this.productCategory.id,
              name: this.productCategory.categoryName,
              description: this.productCategory.description,
            });
          },
          error: err => {
            alert(`There was an error: ${err.message}`);
          }
        }
      );
    }else{
      this.formTitle = 'Thêm mới thể loại';
      this.mode = 2;
    }
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
  }

  get id() { return this.addProductCategoryFormGroup.get('id'); }
  get name() { return this.addProductCategoryFormGroup.get('name'); }
  get description() { return this.addProductCategoryFormGroup.get('description'); }


  onSubmit() {
    this.submitted = true;
    if (this.addProductCategoryFormGroup.invalid) {
      this.addProductCategoryFormGroup.markAllAsTouched();
      return;
    }

    if (this.mode === 1) {
      this.openDialog1('Bạn có muốn cập nhật thể loại này không?', 'Yes', 'No');
    }else{
      this.openDialog1('Bạn có muốn thêm thể loại này không?', 'Yes', 'No');
    }

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
        this.save();
      }
    });

  }

  save(){
    const productCategory = new ProductCategory();
    productCategory.id = this.addProductCategoryFormGroup.get('id').value;
    productCategory.categoryName = this.addProductCategoryFormGroup.get('name').value;
    productCategory.description = this.addProductCategoryFormGroup.get('description').value;
    productCategory.active = true;

    this.productCategoryService.getByName(this.addProductCategoryFormGroup.get('name').value).subscribe(
      {
        next: response => {

          this.openDialog('Tên thể loại đã tồn tại', 'Back to list', 'Continue');

        },
        error: err => {
          this.productCategoryService.saveProduct(productCategory).subscribe(
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
      }
    );



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
        this.route.navigateByUrl('admin/product-category');
      }else{
        this.submitted = false;
        this.addProductCategoryFormGroup.reset();
      }
    });

  }

  reset(event: any){
    event.preventDefault();
    this.addProductCategoryFormGroup.reset();
  }

  backClicked() {
    this.location.back();
  }

}
