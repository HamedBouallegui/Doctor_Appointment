import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppointmentService } from '../services/appointment.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpHeaders } from '@angular/common/http';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  date: string;
}

interface AppointmentStats {
  totalAppointments: number;
  todayAppointments: number;
  pendingApproval: number;
  availableSlots: number;
}

interface Appointment {
  _id: string;
  patientName: string;
  date: string;
  time: string;
  service: string;
  status: string;
  notes?: string;
  user: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  currentService: string = 'overview';
  users: User[] = [];
  loading: boolean = false;
  error: string = '';
  
  stats: AppointmentStats = {
    totalAppointments: 0,
    todayAppointments: 0,
    pendingApproval: 0,
    availableSlots: 45 // This could be calculated based on your business logic
  };

  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Current user:', user); // Debug user object
    console.log('Auth token:', this.authService.getToken()); // Debug token
    
    if (!user || user.role !== 'admin') {
      this.error = 'You need admin privileges to access this page';
      // Redirect to login instead of back to admin
      this.router.navigate(['/login']);
      return;
    }
    
    this.fetchAppointments();
    if (this.currentService === 'users') {
      this.fetchUsers();
    }
  }

  fetchAppointments(): void {
    this.loading = true;
    this.error = '';
    
    this.appointmentService.getAllAppointments().subscribe(
      (data) => {
        console.log('Appointments data received:', data); // Add this line
        this.appointments = data;
        this.filteredAppointments = [...this.appointments];
        this.updateStats();
        this.filterAppointmentsByService(this.currentService);
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching appointments:', error.status, error.message);
        this.error = `Failed to load appointments: ${error.status} ${error.message}`;
        this.loading = false;
      }
    );
  }

  updateStats(): void {
    // Calculate total appointments
    this.stats.totalAppointments = this.appointments.length;
    
    // Calculate today's appointments
    const today = new Date().toISOString().split('T')[0];
    this.stats.todayAppointments = this.appointments.filter(
      app => new Date(app.date).toISOString().split('T')[0] === today
    ).length;
    
    // Calculate pending appointments
    this.stats.pendingApproval = this.appointments.filter(
      app => app.status === 'Pending'
    ).length;
  }

  switchService(service: string) {
    this.currentService = service;
    if (service === 'users') { // Changed from 'All Users' to 'users'
      this.fetchUsers();
    } else {
      this.filterAppointmentsByService(service);
    }
  }

  fetchUsers(): void {
    this.loading = true;
    this.error = '';
    
    // Fix the URL to match your API structure
    this.http.get<User[]>(`${environment.apiUrl}/api/users`, { headers: this.getHeaders() }).subscribe(
      (data) => {
        this.users = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
      }
    );
  }

  // Add this method to get headers with auth token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-auth-token': token || ''
    });
  }

  filterAppointmentsByService(service: string): void {
    if (service === 'overview') {
      this.filteredAppointments = [...this.appointments];
    } else {
      // Convert service name to match the values in your database
      const serviceMap: {[key: string]: string} = {
        'general': 'General Consultation',
        'dental': 'Dental Care',
        'pediatrics': 'Pediatrics',
        'cardiology': 'Cardiology'
      };
      
      const serviceValue = serviceMap[service];
      if (serviceValue) {
        this.filteredAppointments = this.appointments.filter(
          app => app.service === serviceValue
        );
      }
    }
  }

  getCurrentServiceTitle(): string {
    const titles: { [key: string]: string } = {
      overview: 'Dashboard Overview',
      general: 'General Consultation Dashboard',
      dental: 'Dental Care Dashboard',
      pediatrics: 'Pediatrics Dashboard',
      cardiology: 'Cardiology Dashboard',
      'users': 'User Management' // Changed from 'All Users' to 'users'
    };
    return titles[this.currentService] || 'Dashboard';
  }

  approveAppointment(appointment: Appointment): void {
    const updatedAppointment = { ...appointment, status: 'Approved' };
    this.updateAppointmentStatus(appointment._id, updatedAppointment);
  }

  rejectAppointment(appointment: Appointment): void {
    const updatedAppointment = { ...appointment, status: 'Rejected' };
    this.updateAppointmentStatus(appointment._id, updatedAppointment);
  }

  updateAppointmentStatus(id: string, updatedAppointment: any): void {
    this.appointmentService.updateAppointment(id, updatedAppointment).subscribe(
      (response) => {
        // Update the appointment in the local array
        const index = this.appointments.findIndex(app => app._id === id);
        if (index !== -1) {
          this.appointments[index] = response;
          this.filterAppointmentsByService(this.currentService);
          this.updateStats();
        }
      },
      (error) => {
        console.error('Error updating appointment:', error);
        this.error = 'Failed to update appointment status. Please try again.';
      }
    );
  }

  viewAppointment(appointment: Appointment): void {
    // Implementation for viewing appointment details
    // You could open a modal or navigate to a details page
    console.log('Viewing appointment:', appointment);
  }

  refreshData(): void {
    this.fetchAppointments();
    this.fetchUsers(); // Add this line to always fetch users when refreshing
  }
}
