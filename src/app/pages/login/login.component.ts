import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  FormArray,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  NgForm,
  FormGroupDirective,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ButtonComponent } from '../../@core/components/button/button.component';
import { AuthService } from '../../@core/services/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AlertService } from '../../@core/services/alert/alert.service';
import { AlertComponent } from '../../@core/components/alert/alert.component';
import { Subscription } from 'rxjs';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    ButtonComponent,
    MatSnackBarModule,
    AlertComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  isLoggedIn: boolean = true;
  buttonsPropertys = [
    {
      text: 'Cadastrar',
      color: 'secondary',
      size: 'large',
      disabled: false,
      click: () => this.register(),
    },
    {
      text: 'Login',
      color: 'primary',
      size: 'large',
      disabled: false,
      click: () => this.onSubmit(),
    },
  ];
  loading = false;
  submitted = false;
  error = '';
  private subscription: Subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private alertService: AlertService
  ) {
    this.registerForm = this.fb.group({
      credentials: this.fb.array([]),
    });
    this.addCredentials();
  }

  ngOnInit(): void {}

  get credentials(): FormArray {
    return this.registerForm.get('credentials') as FormArray;
  }

  addCredentials() {
    const credentialGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: 'new User',
      role: 1,
    });
    this.credentials.push(credentialGroup);
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const email = this.credentials.at(0).get('email')?.value;
    const password = this.credentials.at(0).get('password')?.value;

    this.loading = true;
    this.authService.login(email, password).subscribe({
      next: () => {
        window.open('/register-company', '_self');
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }

  register() {
    this.authService.register(this.credentials.at(0).value).subscribe({
      next: () => {
        this.alertService.showAlert(
          'Registro concluído com sucesso!',
          'Ok!',
          3000,
          'success'
        );
      },
      error: (error) => {
        this.error = error;
        this.alertService.showAlert(`${error.error.message}`);
        this.loading = false;
      },
    });
  }

  buttonClick(index: number) {
    this.buttonsPropertys[index].click();
  }
}
