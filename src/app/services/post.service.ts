import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PostService {

  constructor(private http: HttpClient) { }

  add(data): Promise<any> {
    return this.http.post<any>(`${environment.apiUrl}post`, data).toPromise();
  }

  delete(id): Promise<any> {
    return this.http.delete<any>(`${environment.apiUrl}post/${id}`).toPromise();
  }

  getById(id: number): Promise<any> {
    return this.http.get<any>(`${environment.apiUrl}post/${id}`).toPromise();
  }

  update(data): Promise<any> {
    return this.http.put<any>(`${environment.apiUrl}post/${data.id}`, data).toPromise();
  }
}
