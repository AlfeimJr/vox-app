import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginComponent } from '../../../pages/login/login.component';
import { User } from '../../Interfaces/user.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    RouterModule.forRoot([{ path: 'login', component: LoginComponent }]);
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store user data', () => {
    const dummyUser = { email: 'test@test.com', token: '12345' };
    const email = 'test@test.com';
    const password = 'password';

    service.login(email, password).subscribe((user) => {
      expect(user).toEqual(dummyUser);
      expect(localStorage.getItem('currentUser')).toEqual(
        JSON.stringify(dummyUser)
      );
      expect(service.currentUserValue).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyUser);
  });

  it('should register a user', () => {
    const dummyUser = { id: 1, email: 'test@test.com' };
    const user = { email: 'test@test.com', password: 'password' };

    service.register(user as User).subscribe((response) => {
      expect(response).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/user`);
    expect(req.request.method).toBe('POST');
    req.flush(dummyUser);
  });

  it('should logout and clear user data', () => {
    const navigateSpy = spyOn(router, 'navigate');
    service.logout();
    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(service.currentUserValue).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
