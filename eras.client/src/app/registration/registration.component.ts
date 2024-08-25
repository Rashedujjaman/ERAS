import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule, FormControl, FormBuilder, FormGroup, Validators, FormsModule, AbstractControl } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; 

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatCheckboxModule, MatRadioModule]
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      UserName: new FormControl<string | null>(null, [Validators.required]),
      Name: new FormControl<string | null>(null, [Validators.required]),
      Alias: new FormControl<string | null>(null, [Validators.required]),
      Email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
      Password: new FormControl<string | null>(null, [Validators.required, this.passwordStrengthValidator]),
      UserRoleId: new FormControl<number | null>(null, [Validators.required])
    });
  }

  passwordStrengthValidator(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasNonAlphanumeric = /[\W_]/.test(value);
    const valid = hasUpperCase && hasLowerCase && hasNumeric && hasNonAlphanumeric;

    if (!valid) {
      return { passwordStrength: true };
    }
    return null;
  }

  get f() { return this.registrationForm.controls; }

  register(): void {
    this.loading = true;

    if (this.registrationForm.invalid) {
      this.loading = false;
      return;
    }

    const registrationData = this.registrationForm.value;

    this.http.post('/api/registration/register', registrationData)
      .subscribe(
        (response: any) => {
          console.log(response);
          alert('User Registered Successfully');
          this.registrationForm.reset();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          alert(`An error occurred: ${error.message}`);
        }
      );
    this.loading = false;
  }
}
