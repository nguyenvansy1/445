import { Component, OnInit } from '@angular/core';
import {Order} from '../../../models/entity/order';
import {User} from '../../../models/entity/user';
import {Statistical} from '../../../models/entity/statistical';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  orders: Order[];
  users: User[];
  userLength: number;
  orderLength: number;
  statistical: Statistical[];

  labels: string[] = [];
  data: number[] = [];
  year = 2022;
  years!: number[];
  myChartBar: Chart;
  myChartDoughnut: Chart;

  image!: string;

  user!: User;
  constructor() { }

  ngOnInit(): void {
  }

}
