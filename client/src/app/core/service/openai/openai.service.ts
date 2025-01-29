import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {

  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = environment.OPENAPI_ApiKey

  constructor(private http: HttpClient) {}

  getResponse(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`
    });

    const body = {
      model: 'gpt-3.5-turbo', // Replace with your model (e.g., gpt-4)
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100 // Limit the number of tokens in the response
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
