import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private budgetData: any = null; // This variable will cache the data

  constructor(private http: HttpClient) { }

  getBudget(): Observable<any> {
    // Check if the data is already in our cache
    if (this.budgetData) {
      // If yes, return the cached data as an Observable
      return of(this.budgetData);
    } else {
      // If no, make the HTTP call to the backend
      return this.http.get('http://localhost:3000/budget').pipe(
        tap(data => {
          // Store the newly fetched data in our cache variable
          this.budgetData = data;
        })
      );
    }
  }
}
