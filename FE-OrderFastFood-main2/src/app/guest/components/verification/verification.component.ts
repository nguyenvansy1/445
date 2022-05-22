import { Component, OnInit } from '@angular/core';
import {AutheService} from '../../../service/authe.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {
  isSuccessful = false;
  isSendMail = false;

  constructor(private route: ActivatedRoute, private auth: AutheService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      const code = param.code;
      console.log(code);
      if (code == null){
        this.isSendMail = false;
      }
      else {
        this.isSendMail = true;
        this.auth.verifyPassword(code).subscribe(data => {
          console.log(data.message);
          this.isSuccessful = (data.message === 'activated');
        },
          err => {
            this.isSuccessful = false;
          });
      }
    });
  }
}
