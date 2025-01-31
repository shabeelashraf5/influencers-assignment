import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient){}

  displayUserDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaderboard`);
  }

}
