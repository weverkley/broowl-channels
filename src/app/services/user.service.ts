import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) { }

  getLocalUser() {
    return JSON.parse(localStorage.getItem('user')) || null;
  }

  getUserById(id): Promise<any> {
    return this.http.get<any>(`${environment.apiUrl}user/${id}`).toPromise();
  }

  update(data): Promise<any> {
    return this.http.put<any>(`${environment.apiUrl}user/${data.id}`, data).toPromise();
  }

  uploadProfile(data): Promise<any> {
    return this.http.post<any>(`${environment.apiUrl}user/upload/profile`, data).toPromise();
  }
}
