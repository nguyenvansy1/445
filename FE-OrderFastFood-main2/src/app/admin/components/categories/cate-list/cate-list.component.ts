import { Component, OnInit } from '@angular/core';
import {ProductCategory} from '../../../../models/entity/product-category';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ProductCategoryService} from '../../../../service/product-category.service';
import {ProductService} from '../../../../service/product.service';
import {DialogComponent} from '../../../../shared/components/dialog/dialog.component';
import {DialogRedirectComponent} from '../../../../shared/components/dialog-redirect/dialog-redirect.component';

@Component({
  selector: 'app-cate-list',
  templateUrl: './cate-list.component.html',
  styleUrls: ['./cate-list.component.css']
})
export class CateListComponent implements OnInit {
  index = 1;

  productCategory: ProductCategory;
  thePageNumber = 1;
  thePageSize = 10;
  theTotalElements = 0;
  itemPerPage = 1;

  currentCategoryId = 1;
  previousCategoryId: number;
  productCategories: ProductCategory[] = [];
  previousKeyword: string = null;

  constructor(
    private routerActive: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private productCategoryService: ProductCategoryService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.routerActive.paramMap.subscribe(() => {
      this.listCategories();
    });
  }

  listCategories(){
    this.productCategoryService.getAllProductCategoryPaginate(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
  }

  processResult() {
    console.log('processResult');

    return data => {
      console.log(data);
      this.productCategories = data.content;
      this.thePageNumber = data.number + 1;
      this.thePageSize = data.size;
      this.theTotalElements = data.totalElements;
      this.processItemPerPage();
    };
  }

  processItemPerPage() {
    if (this.thePageNumber * this.thePageSize > this.theTotalElements) {
      this.itemPerPage = this.theTotalElements;
    } else {
      this.itemPerPage = this.thePageNumber * this.thePageSize;
    }
  }

  updatePageSize(pageSize) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listCategories();
  }


  delete(id: number) {
    this.openDialog('Do you want to Delete product?', 'Yes', 'No', id);
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
        this.deleteCate(id);
      }
    });

  }


  deleteCate(value){
    this.productService.getProductByCategoryId(value).subscribe(
      {
        next: response => {
          if (response.length > 0) {
            this.openDialogError('Không Thể xoá vì vẫn còn sản phẩm thuộc thể loại này', 'go to list', 'cancel');
          }else{
            this.productCategoryService.getProductCategoryById(value).subscribe(data => {
              console.log(data);
              this.productCategoryService.deleteProduct(value).subscribe(
                data => {
                  // this.openDialog('Bạn có chắc xoá thể loại này không?', 'Yes', 'No', value);
                  this.openDialogBack('Deleted successfully', 'Back to list');
                }, (error) => {
                  console.log(error);
                  this.openDialogError('Error! Not found product', 'go to list', 'cancel');
                }
              );
            }, error => {
              this.openDialogError('Không tìm thấy thể loại', 'go to list', 'cancel');
            });
          }
        },
        error: err => {
          this.openDialogError('Error', 'go to list', 'cancel');
        }
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
        this.listCategories();
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
        this.listCategories();
      }
    });
  }

  detail(id: number) {

  }

  update(id: number) {
    this.productCategoryService.getProductCategoryById(id).subscribe((data) => {
      console.log(data);
      this.router.navigateByUrl(`admin/product-category/update/${id}`);
      // this.productCategoryService.updateProduct(data, id).subscribe(next => {
      //   this.openDialogBack('Chỉnh sửa thành công!', 'Ok');
      // }, error => {
      //   this.openDialogError('Lỗi, Không tìm thấy.', 'Quay lại danh sách', 'Huỷ');
      // });

    });
  }
}

