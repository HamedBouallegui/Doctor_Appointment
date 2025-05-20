import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api'; // Ensure this is your correct API base URL

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    // This is an example. Adjust if you use a different auth mechanism or no auth.
    const token = localStorage.getItem('adminToken'); // Or however you store an admin auth token
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getAllUsers(): Observable<any[]> { // Added type for clarity
    return this.http.get<any[]>(`${this.apiUrl}/users/all`, { headers: this.getHeaders() }); // Ensure '/users/all' is your correct backend endpoint for all users
  }

  getAllAppointments(): Observable<any[]> { // Added type for clarity
    return this.http.get<any[]>(`${this.apiUrl}/appointments/all`, { headers: this.getHeaders() }); // Ensure '/appointments/all' is your correct backend endpoint
  }

  // Example methods for updating appointment status (implement actual API calls)
  updateAppointmentStatus(appointmentId: string, status: string): Observable<any> {
    // Replace with your actual API endpoint and payload for updating an appointment
    return this.http.put(`${this.apiUrl}/appointments/${appointmentId}/status`, { status }, { headers: this.getHeaders() });
  }

  // Example methods for user actions (implement actual API calls)
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`, { headers: this.getHeaders() });
  }
}