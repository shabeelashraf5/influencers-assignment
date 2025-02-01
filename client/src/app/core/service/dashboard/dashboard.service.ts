import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Influencers } from '../../../models/influencers.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  addInfluencers(list: Influencers): Observable<any> {
    return this.http.post(`${this.apiUrl}/influencers`, list);
  }


  displayUserDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  deletelist(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}/influencers`);
  }

  displayInfluencers(userId: string): Observable<any>{
    return this.http.get(`${this.apiUrl}/page/${userId}`); 
  }
}
