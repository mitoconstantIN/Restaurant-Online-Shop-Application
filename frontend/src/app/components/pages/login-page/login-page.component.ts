import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { TitleComponent } from "../../partials/title/title.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { IUserLogin } from '../../../shared/interfaces/IUserLogin';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/User';
import { InputContainerComponent } from "../../partials/input-container/input-container.component";
import { InputValidationComponent } from "../../partials/input-validation/input-validation.component";
import { TextInputComponent } from "../../partials/text-input/text-input.component";
import { DefaultButtonComponent } from "../../partials/default-button/default-button.component";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [TitleComponent, CommonModule, ReactiveFormsModule, InputContainerComponent, InputValidationComponent, TextInputComponent, DefaultButtonComponent, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit{
  
  loginForm!:FormGroup;
  isSubmitted = false;
  returnUrl='';
  constructor(private formBuilder:FormBuilder, 
    private userService:UserService,
    private activatedRoute:ActivatedRoute,
    private router:Router){}

  ngOnInit(): void {
      this.loginForm = this.formBuilder.group({
        email:['', [Validators.required, Validators.email]],
        password:['', Validators.required]
      });   

      this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get fc(){
    return this.loginForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;
  
    const loginCredentials: IUserLogin = {
      email: this.fc.email.value,
      password: this.fc.password.value
    };
  
    console.log('Login Credentials:', loginCredentials); // Check the data being sent
  
    this.userService.login(loginCredentials).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnUrl || '/');
      },
      error: (error) => {
        console.error('Login failed', error); // Log the error response
      }
    });
  }
  

  
}