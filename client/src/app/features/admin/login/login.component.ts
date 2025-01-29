import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../core/layout/navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { AdminloginService } from '../../../core/service/auth/adminlogin.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink,CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  myForm!: FormGroup
  passwordInvalid: string = '';
  emailInvalid: string = '';


  private loginService = inject(AdminloginService)
  private router = inject(Router);



  ngOnInit() {

    this.loginForm()
    
  }

  loginForm() {
    this.myForm = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [
        Validators.minLength(6),
        Validators.required,
      ]),
    });
  }

  adminLoginIn() {
    this.passwordInvalid = '';
    this.emailInvalid = '';

    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const userDetails = this.myForm.value;
    this.loginService
      .login(userDetails.email, userDetails.password)
      .subscribe({
        next: (response) => {
          
            this.router.navigate(['/dashboard']);
          
        },
        error: (error) => {
          if (error.status === 400) {
            this.passwordInvalid = 'Entered Password is Invalid';
          } else if (error.status === 401) {
            this.emailInvalid = 'Invalid Email, Please register your account';
          } else {
            console.error('Unexpected Error:', error);
          }
        },
      });
  }
 

}
