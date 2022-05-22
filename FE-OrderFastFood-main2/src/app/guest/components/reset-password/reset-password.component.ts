import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {AutheService} from '../../../service/authe.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  formGroup: FormGroup;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isSubmitted = false;
  formValid = false;

  constructor(private formBuilder: FormBuilder,
              private authService: AutheService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      username: ['']
    });
  }

  onSubmit(){
    this.isSubmitted = true;
    console.log(this.formGroup);
    this.authService.resetPassword(this.formGroup.value.username).subscribe(
      data => {
        this.toastr.success('Email đã được gửi!', 'Thông báo', {
          timeOut: 2500,
          extendedTimeOut: 1500
        });
      }, error => {
        this.toastr.error('Sai tên đăng nhập hoặc tên đăng nhập chưa được đăng ký', 'Gửi email thất bại: ', {
          timeOut: 3000,
          extendedTimeOut: 1500
        });
      }
    );
  }

}
