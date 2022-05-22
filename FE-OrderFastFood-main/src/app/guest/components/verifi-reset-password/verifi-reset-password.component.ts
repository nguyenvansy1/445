import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AutheService} from '../../../service/authe.service';
import {compareValidator} from '../../../common/validatePassword';

@Component({
  selector: 'app-verifi-reset-password',
  templateUrl: './verifi-reset-password.component.html',
  styleUrls: ['./verifi-reset-password.component.css']
})
export class VerifiResetPasswordComponent implements OnInit {
  isSuccessful = true;
  isSendMail: boolean;
  isSubmited: true;
  code: string;
  formGroup: FormGroup;

  validationMessage = {
    newPassword: [
      {type: 'required', message: 'Mật khẩu không được để trống.'},
      {type: 'compare', message: 'Mật khẩu mới không được trùng với mật khẩu cũ.'},
      {type: 'pattern', message: 'Vui lòng nhập mật khẩu đúng định dạng trên 8 ký tự gồm chữ hoa,thường và ký tự đặc biệt.'}
    ],
    confirmPassword: [
      {type: 'required', message: 'Mật khẩu không được để trống.'},
      {type: 'compare', message: 'Mật khẩu không khớp xin vui lòng thử lại.'}, ]
  };

  constructor(private route: ActivatedRoute,
              private authService: AutheService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private router: Router) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      // tslint:disable-next-line:max-line-length
      newPassword: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&.]{8,32}$')]],
      confirmPassword: ['', [Validators.required, compareValidator('newPassword')]],
    });
    this.route.queryParams.subscribe(params => {
      const code = params.code;
      if (code == null) {
        this.isSendMail = false;
      } else {
        this.isSendMail = true;
        this.isSuccessful = false;
        this.authService.verifyPassword(code).subscribe(
          data => {
            this.isSuccessful = (data.message === 'accepted');
          },
          err => {
            this.isSuccessful = false;
          }
        );
      }
    });

  }

  onSubmit(){
    if (this.formGroup.value.newPassword === this.formGroup.value.confirmPassword){
      this.route.queryParams.subscribe(params => {
        this.code = params.code;
      });
      this.authService.doResetPassword(this.formGroup.value.newPassword, this.code).subscribe(data => {
        this.toastr.success('Mật khẩu đã được thay đổi!', 'Thành công');
        this.router.navigateByUrl('');
      });
    } else {
      this.toastr.error('Nhập xác minh mật khẩu không khớp!', 'Lỗi: ', {
        timeOut: 3500,
        extendedTimeOut: 1500
      });
    }
  }

}
