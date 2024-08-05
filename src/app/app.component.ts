import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from './@core/components/top-bar/top-bar.component';
import { AuthService } from './@core/services/auth/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoginComponent } from './pages/login/login.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    TopBarComponent,
    LoginComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'vox-app';
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  subscription: Subscription = new Subscription();
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((res) => {
      this.isLoggedIn.next(!!res);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
