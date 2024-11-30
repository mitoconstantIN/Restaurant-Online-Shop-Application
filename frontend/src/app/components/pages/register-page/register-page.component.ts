import { Component, OnInit } from '@angular/core';
import { TitleComponent } from "../../partials/title/title.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PasswordsMathValidator } from '../../../shared/validators/password_match_validator';
import { IUserRegister } from '../../../shared/IUserRegister';
import { TextInputComponent } from "../../partials/text-input/text-input.component";
import { DefaultButtonComponent } from "../../partials/default-button/default-button.component";

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [TitleComponent, TextInputComponent, ReactiveFormsModule, DefaultButtonComponent, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit{
  
  registerForm!: FormGroup;
  isSubmitted = false;

  returnUrl='';

  constructor(
    private formBuilder:FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router:Router
  ){}

  ngOnInit(): void {
  this.registerForm = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', [Validators.required, Validators.minLength(5)]),
    email: this.formBuilder.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.formBuilder.nonNullable.control('', [Validators.required, Validators.minLength(5)]),
    confirmPassword: this.formBuilder.nonNullable.control('', [Validators.required]),
    address: this.formBuilder.nonNullable.control('', [Validators.required, Validators.minLength(10)])
  }, {
    validators: PasswordsMathValidator('password', 'confirmPassword')
  });

  this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
}
  
  get fc(){
    return this.registerForm.controls;
  }
    submit(){
      this.isSubmitted = true;
      if(this.registerForm.invalid) return;

      const fv= this.registerForm.value;
      const user:IUserRegister={
        name: fv.name,
        email: fv.email,
        password: fv.password,
        confirmPassword: fv.confirmPassword,
        address: fv.address
      };

      this.userService.register(user).subscribe(_ => {
        this.router.navigateByUrl(this.returnUrl);
      })
    }
  

}
