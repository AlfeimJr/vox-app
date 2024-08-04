import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../Interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string = 'http://localhost:3000';
  constructor(private httpClient: HttpClient) {}

  getLoggedUser() {
    return this.httpClient.get<User>(`${this.apiUrl}/user/me`);
  }
}
