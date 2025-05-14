import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:3000/api/chat';

  constructor(private http: HttpClient) {}

  // Get headers for Gemini API
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
  }

  // Send message to Gemini API
  sendMessage(message: string): Observable<any> {
    return this.http.post(this.apiUrl, { message }, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Chatbot API Error:', error);
        if (error.error) {
          console.error('API Error Details:', error.error);
        }
        throw error;
      })
    );
  }
}