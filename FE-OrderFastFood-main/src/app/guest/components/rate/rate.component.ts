import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {Rate} from '../../../models/entity/rate';
import {User} from '../../../models/entity/user';
import {Product} from '../../../models/entity/product';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TokenStorageService} from '../../../service/token-storage.service';
import {RateService} from '../../../service/rate.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css']
})
export class RateComponent implements OnInit {

  star = 5;
  comment: string;
  rate: Rate;
  user: User;

  @Input() product: Product;


  constructor(private modalService: NgbModal,
              private tokenStorageService: TokenStorageService,
              private rateService: RateService, private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, {centered: true});
  }

  rating() {
    this.user = this.tokenStorageService.getUser();
    let _user = new User();
    _user.id = this.user.id;

    console.log(_user);
    this.rate = new Rate(this.star, this.comment, this.product.id, _user.id );
    console.log(this.rate);
    this.rateService.saveRate(this.rate).subscribe(data => {
      this.toastr.success('Đánh giá thành công!', 'Hệ thống');
      this.modalService.dismissAll();
    });

  }

}
