import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = environment.apiUrl + '/api/appointments';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth-token': token || ''
    });
  }

  getAppointmentStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`, { headers: this.getHeaders() });
  }

  getUserAppointments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`, { headers: this.getHeaders() });
  }
  
  getAllAppointments(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  getAppointmentsByService(service: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/service/${service}`, { headers: this.getHeaders() });
  }

  createAppointment(appointmentData: any): Observable<any> {
    return this.http.post(this.apiUrl, appointmentData, { headers: this.getHeaders() });
  }

  updateAppointment(id: string, appointmentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, appointmentData, { headers: this.getHeaders() });
  }

  // Cancel an appointment
  cancelAppointment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
