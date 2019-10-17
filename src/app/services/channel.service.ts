import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ChannelService {

  constructor(private http: HttpClient) { }

  getById(id: number): Promise<any> {
    return this.http.get<any>(`${environment.apiUrl}channel/${id}`).toPromise();
  }

  update(data): Promise<any> {
    return this.http.put<any>(`${environment.apiUrl}channel/${data.id}`, data).toPromise();
  }

  getPostsByChannelId(id: number): Promise<any> {
    return this.http.get<any>(`${environment.apiUrl}channel/${id}/post`).toPromise();
  }

  uploadCover(data): Promise<any> {
    return this.http.post<any>(`${environment.apiUrl}channel/upload/cover`, data).toPromise();
  }
}
