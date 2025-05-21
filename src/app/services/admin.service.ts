import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment'; // It's good practice to use the environment for apiUrl

// Define interfaces for User and Appointment if not already globally available or imported
// For example:
// interface User { ... }
// interface Appointment { ... }

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl + '/api'; // Using environment.apiUrl

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    if (token) {
      headers = headers.set('x-auth-token', token);
    }
    return headers;
  }

  getAllUsers(): Observable<any[]> { // Replace 'any[]' with a specific User[] interface if available
    return this.http.get<any[]>(`${this.apiUrl}/users`, { headers: this.getHeaders() });
  }

  getAllAppointments(): Observable<any[]> { // Replace 'any[]' with a specific Appointment[] interface if available
    return this.http.get<any[]>(`${this.apiUrl}/appointments`, { headers: this.getHeaders() });
  }

  // updateAppointmentStatus was in your component, 
  // if you want to move it to service, it would be updateAppointment
  updateAppointment(appointmentId: string, updatedData: any): Observable<any> { // Renamed for clarity
    return this.http.put(`${this.apiUrl}/appointments/${appointmentId}`, updatedData, { headers: this.getHeaders() });
  }
}