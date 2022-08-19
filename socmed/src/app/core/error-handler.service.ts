import { Injectable } from '@angular/core';
import { Console } from 'console';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandleService {
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.warn(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
