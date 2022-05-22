import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {Rate} from '../models/entity/rate';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RateService {

  private rateUrl = 'http://localhost:8080/api/rate';

  constructor(private httpClient: HttpClient) { }

  saveRate(rate: Rate): Observable<any>{
    return this.httpClient.post<Rate>(this.rateUrl, rate).pipe(catchError(this.handleError));
  }

  handleError(err){
    return throwError(err.message || 'serve error');
  }
}
