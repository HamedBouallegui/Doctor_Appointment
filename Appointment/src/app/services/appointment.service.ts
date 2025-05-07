import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:5001/api/appointments'; // Updated to use port 5001

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Get auth headers
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth-token': token || ''
    });
  }

  // Create a new appointment
  createAppointment(appointmentData: any): Observable<any> {
    return this.http.post(this.apiUrl, appointmentData, { headers: this.getHeaders() });
  }

  // Get all appointments for the logged-in user
  getUserAppointments(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  // Get a specific appointment
  getAppointment(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Update an appointment
  updateAppointment(id: string, appointmentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, appointmentData, { headers: this.getHeaders() });
  }

  // Cancel an appointment
  cancelAppointment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
