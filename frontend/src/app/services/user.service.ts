import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../shared/models/User';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { HttpClient } from '@angular/common/http';
import { USER_LOGIN_URL, USER_REGISTER_URL } from '../shared/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { IUserRegister } from '../shared/IUserRegister';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(new User()); // Initialize with default
  public userObservable: Observable<User>;

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.userObservable = this.userSubject.asObservable();
    
    // Only load from localStorage in the browser

    if (this.isBrowser()) {
      const user = this.getUserFromLocalStorage();
      if (user) {
        this.userSubject.next(user);
      }
    }
  }

  public get currentUser():User{
    return this.userSubject.value;
  }
  
  login(userLogin: IUserLogin): Observable<User> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          console.log('Login response:', user);  // Log the server response
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to Classic Restaurant ${user.name}!`,
            'Login Successful'
          );
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed');
        }
      })
    );
  }
  

  register(userRegister:IUserRegister): Observable<User>{
    return this.http.post<User>(USER_REGISTER_URL, userRegister).pipe(
      tap({
        next: (user) => { 
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to the Classic, ${user.name}`,
            'Register Successful'
          )
        },
        error: (errorResponse) =>{
          this.toastrService.error(errorResponse.error, 'Register Failed')
        }
      })
    )
  }

  logout(){
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }

  private setUserToLocalStorage(user: User): void {
    if (this.isBrowser()) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  private getUserFromLocalStorage(): User | null {
    if (!this.isBrowser()) {
      return null; // Avoid accessing localStorage in non-browser environments
    }
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) as User : null;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}