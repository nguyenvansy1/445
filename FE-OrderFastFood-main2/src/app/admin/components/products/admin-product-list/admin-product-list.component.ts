import {Component, OnInit} from '@angular/core';
import {DialogComponent} from '../../../../shared/components/dialog/dialog.component';
import {DialogRedirectComponent} from '../../../../shared/components/dialog-redirect/dialog-redirect.component';
import {ProductCategoryService} from '../../../../service/product-category.service';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../../service/product.service';
import {ProductCategory} from '../../../../models/entity/product-category';
import {Product} from '../../../../models/entity/product';
import {Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.css']
})
export class AdminProductListComponent implements OnInit {

  results$: Observable<any>;
  subject = new Subject();
  stt = 1;
  index = 1;
  products: Product[] = [];
  productIdExist: number;

  thePageNumber = 1;
  thePageSize = 10;
  theTotalElements = 0;
  itemPerPage = 1;

  currentCategoryId = 1;
  previousCategoryId: number;
  searchMode = false;
  productCategory: ProductCategory[] = [];
  keywordForSearch = '';
  valueForFilter = 0;
  previousKeyword: string = null;
  modalText = '';
  newProductMode = false;
  filterMode = false;

  constructor(
    private productService: ProductService,
    private routerActive: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private productCategoryService: ProductCategoryService,
  ) {
  }


  // fromEvent($("#search"), "keyup").pipe(
  //   map((event: any) => {
  //     return event.target.value;
  //   }),
  //   debounceTime(500),
  //   distinctUntilChanged()
  // )
  // .subscribe(
  //   (text: string) => {
  //     this.searchEmployee();
  //   },
  //   (err) => {
  //     console.log(err);
  //   }
  // );

  ngOnInit(): void {
    this.routerActive.paramMap.subscribe(() => {
      this.listProducts();
    });
    this.productCategoryService.getAllProductCategory().subscribe(
      data => {
        this.productCategory = data;
        console.log(this.productCategory);
      }
    );

    //   this.results$ = this.subject.pipe(
    //     debounceTime(1000),
    //     map(searchText => this.httpClient.get("/api/search?q=" + searchText))
    // )

  }

  removeRequestParam() {
    this.router.navigate([], {
      queryParams: {
        new: 0
      },
      queryParamsHandling: 'merge',
    });
  }

  doSearch(value: string) {
    this.removeRequestParam();

    if (this.valueForFilter !== 0) {
      this.searchByNameAndCategory(value);
    } else {
      this.searchByName(value);
    }
  }

  setValueForFilter(value) {

    this.removeRequestParam();

    this.valueForFilter = value;
    this.keywordForSearch = '';
    this.filterMode = true;

    this.listProducts();
  }

  listProducts() {

    this.routerActive.queryParams.subscribe(params => {

      if (this.filterMode) {
        this.newProductMode = false;
      } else if (params.new === 1) {
        this.newProductMode = true;
      } else {
        this.newProductMode = false;
      }
    });

    if (this.newProductMode) {
      this.getNewProduct();
    } else {
      if (this.keywordForSearch !== '' && this.valueForFilter !== 0) {
        this.searchByNameAndCategory(this.keywordForSearch);
      } else if (this.keywordForSearch !== '' && this.valueForFilter === 0) {
        this.searchByName(this.keywordForSearch);
      } else {
        if (this.valueForFilter !== 0) {
          this.filterByCategory(this.valueForFilter);
        } else {
          this.handleListProducts();
        }
      }
    }

  }

  getNewProduct() {
    this.productService.getNewProduct(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
  }

  filterByCategory(value) {
    this.removeRequestParam();
    if (this.previousCategoryId !== value) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = value;
    this.productService.getProductByCategory(this.thePageNumber - 1, this.thePageSize, value).subscribe(this.processResult());
  }

  searchByNameAndCategory(value: string) {

    if (this.previousKeyword !== value) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = value;
    this.productService.getProductByCategoryAndName(this.thePageNumber - 1, this.thePageSize, this.valueForFilter, value)
      .subscribe(this.processResult());

  }

  searchByName(value: string) {
    if (this.previousKeyword !== value) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = value;
    this.productService.getProductByName(this.thePageNumber - 1, this.thePageSize, value).subscribe(this.processResult());
  }


  handleListProducts() {
    const hasIdParameter: boolean = this.routerActive.snapshot.paramMap.has('id');

    if (hasIdParameter) {
      console.log('todo later');
    } else {
      this.getAllProduct(1);
    }
  }

  getAllProduct(oneOrTwo: number) {

    if (this.keywordForSearch !== '' && this.valueForFilter !== 0) {

      this.productService
        .getProductByCategoryAndName(this.thePageNumber - oneOrTwo, this.thePageSize, this.valueForFilter, this.keywordForSearch)
        .subscribe(this.processResultIfDeletedAllItemOfEndPage());

    } else if (this.keywordForSearch !== '' && this.valueForFilter === 0) {

      this.productService
        .getProductByName(this.thePageNumber - oneOrTwo, this.thePageSize, this.keywordForSearch)
        .subscribe(this.processResultIfDeletedAllItemOfEndPage());

    } else if (this.keywordForSearch === '' && this.valueForFilter !== 0) {

      this.productService
        .getProductByCategory(this.thePageNumber - oneOrTwo, this.thePageSize, this.valueForFilter)
        .subscribe(this.processResultIfDeletedAllItemOfEndPage());

    } else {

      this.productService
        .getAllProduct(this.thePageNumber - oneOrTwo, this.thePageSize)
        .subscribe(this.processResult());

    }
  }

  processResultIfDeletedAllItemOfEndPage() {
    return (data) => {
      this.products = data.content;
      this.thePageNumber = data.number + 1;
      this.thePageSize = data.size;
      this.theTotalElements = data.totalElements;
      this.stt = (this.thePageNumber - 1) * this.thePageSize + 1;
    };
  }

  processResult() {

    return (data) => {
      this.products = data.content;
      this.thePageNumber = data.number + 1;
      this.thePageSize = data.size;
      this.theTotalElements = data.totalElements;
      this.processItemPerPage();
    };
  }

  processItemPerPage() {

    if (this.products.length === 0) {

      this.getAllProduct(2);


    } else {
      if (this.thePageNumber * this.thePageSize > this.theTotalElements) {
        this.itemPerPage = this.theTotalElements;
      } else {
        this.itemPerPage = this.thePageNumber * this.thePageSize;
      }
    }


  }

  updatePageSize(pageSize) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  Delete(id: number) {
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
        this.deleteProduct(id);
      }
    });

  }

  deleteProduct(id: number) {

    this.productService.getProductById(id).subscribe(
      data => {
        this.productService.deleteProduct(id).subscribe(
          (data) => {
            this.openDialogBack('Deleted successfully', 'Back to list');
          }, (error) => {
            console.log(error);
            this.openDialogError('Error! Not found product', 'go to list', 'cancel');
          }
        );

      }, error => {
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
        this.listProducts();
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
        this.listProducts();
      }
    });
  }

  clearSearchKeyword() {
    this.keywordForSearch = '';
    this.listProducts();
  }

  checkExist(id: number) {


  }

  update(id: number) {
    this.productService.getProductById(id).subscribe(
      data => {
        this.router.navigateByUrl(`admin/products/update/${id}`);

      }, error => {
        this.openDialogError('Error! Not found product', 'go to list', 'cancel');
      }
    );

  }


  detail(id: number) {
    this.productService.getProductById(id).subscribe(
      data => {
        this.router.navigateByUrl(`admin/products/detail/${id}`);
      }, error => {
        this.openDialogError('Error! Not found product', 'go to list', 'cancel');
      }
    );

  }

}
