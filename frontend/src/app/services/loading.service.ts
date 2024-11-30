import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  constructor() { }

  showLoading(){
    console.log("Loading shown");
    this.isLoadingSubject.next(true);
  }

  hideLoading(){
    console.log("Loading hidden");
    this.isLoadingSubject.next(false);
  }

  get isLoading(){
    return this.isLoadingSubject.asObservable();
  }
}
