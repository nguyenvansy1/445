import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-print-error',
  templateUrl: './print-error.component.html',
  styleUrls: ['./print-error.component.css']
})
export class PrintErrorComponent implements OnInit {

  @Input('control') control: any;

  constructor() { }

  ngOnInit(): void {
  }

}
