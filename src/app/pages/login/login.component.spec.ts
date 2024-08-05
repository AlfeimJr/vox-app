import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../@core/services/auth/auth.service';
import { AlertService } from '../../@core/services/alert/alert.service';
import { ButtonComponent } from '../../@core/components/button/button.component';
import { AlertComponent } from '../../@core/components/alert/alert.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', [
      'login',
      'register',
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const alertServiceMock = jasmine.createSpyObj('AlertService', [
      'showAlert',
    ]);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent, ButtonComponent, AlertComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: AlertService, useValue: alertServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alertServiceSpy = TestBed.inject(
      AlertService
    ) as jasmine.SpyObj<AlertService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.credentials.length).toBe(1);
  });

  it('should add credentials to the form', () => {
    component.addCredentials();
    expect(component.credentials.length).toBe(2);
  });

  it('should display error if form is invalid on submit', () => {
    component.onSubmit();
    expect(component.submitted).toBeTrue();
    expect(component.loading).toBeFalse();
  });

  it('should login successfully if form is valid', () => {
    authServiceSpy.login.and.returnValue(of({}));
    component.credentials.at(0).get('email')?.setValue('test@test.com');
    component.credentials.at(0).get('password')?.setValue('password123');

    component.onSubmit();

    expect(authServiceSpy.login.calls.any()).toBeTrue();
    expect(component.loading).toBeTrue();
  });

  it('should handle login error', () => {
    const errorResponse = { message: 'Invalid credentials' };
    authServiceSpy.login.and.returnValue(throwError(errorResponse));
    component.credentials.at(0).get('email')?.setValue('test@test.com');
    component.credentials.at(0).get('password')?.setValue('password123');

    component.onSubmit();

    expect(authServiceSpy.login.calls.any()).toBeTrue();
    expect(component.error).toEqual(errorResponse.message);
    expect(component.loading).toBeFalse();
  });

  it('should register successfully', () => {
    authServiceSpy.register.and.returnValue(of({}));
    component.credentials.at(0).get('email')?.setValue('test@test.com');
    component.credentials.at(0).get('password')?.setValue('password123');

    component.register();

    expect(authServiceSpy.register.calls.any()).toBeTrue();
    expect(alertServiceSpy.showAlert.calls.any()).toBeTrue();
  });

  it('should handle register error', () => {
    const errorResponse = { message: 'Registration error' };
    authServiceSpy.register.and.returnValue(throwError(errorResponse));
    component.credentials.at(0).get('email')?.setValue('test@test.com');
    component.credentials.at(0).get('password')?.setValue('password123');

    component.register();

    expect(authServiceSpy.register.calls.any()).toBeTrue();
    expect(component.error).toEqual(errorResponse.message);
    expect(component.loading).toBeFalse();
  });

  it('should call button click handler', () => {
    spyOn(component, 'register');
    component.buttonClick(0);
    expect(component.register).toHaveBeenCalled();
  });

  it('should call login click handler', () => {
    spyOn(component, 'onSubmit');
    component.buttonClick(1);
    expect(component.onSubmit).toHaveBeenCalled();
  });
});
