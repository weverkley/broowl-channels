import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private router: Router, private http: HttpClient) { }

  setToken(token: string): void {
    localStorage.setItem('token', JSON.stringify(token));
  }

  getDecodedToken(): any {
    return this.getDecodedAccessToken(JSON.parse(localStorage.getItem('token')));
  }

  getEncodedToken(): any {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.getEncodedToken() !== null;
  }

  signin(data): Promise<any> {
    return this.http.post<any>(`${environment.apiUrl}auth/signin`, data).toPromise();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/signin');
  }

  private getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
}
