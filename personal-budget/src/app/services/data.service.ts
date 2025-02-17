import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private budgetData: any = null;

  constructor(private http: HttpClient) {}

  getBudgetData(): Observable<any> {
    if (this.budgetData) {
      return new Observable(observer => {
        observer.next(this.budgetData);
        observer.complete();
      });
    }
    return this.http.get<{ myBudget: any }>('http://localhost:3000/budget')
      .pipe(tap(data => this.budgetData = data));
  }

  setData(data: any): void {
    this.budgetData = data;
  }
}
