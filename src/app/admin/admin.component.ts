import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Keep HttpHeaders if getHeaders is still used or adminService needs it indirectly
// import { AppointmentService } from '../services/appointment.service'; // Commented out or removed
import { AdminService } from '../services/admin.service'; // Assuming AdminService is created and located here
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
    private adminService: AdminService, // Use AdminService instead of AppointmentService
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router
  ) {}

  private refreshInterval: any;

  ngOnInit(): void {
    const user = this.authService.getUser(); 
    if (!user || user.role !== 'admin') { 
      this.router.navigate(['/connexion']); 
      return; 
    } 
    this.fetchAllData();
    
    // Set up an interval to refresh data every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.fetchAllData();
    }, 30000);
  }

  ngOnDestroy(): void {
    // Clear the interval when component is destroyed
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  fetchAllData(): void { 
    this.fetchAppointments(); 
    this.fetchUsers(); // Fetch users on initial load if needed 
  }

  fetchAppointments(): void {
    console.log('Fetching appointments...');
    this.loading = true;
    this.error = '';
    
    this.adminService.getAllAppointments().subscribe(
      (data) => {
        console.log('Appointments received:', data);
        this.appointments = data;
        this.filteredAppointments = [...this.appointments];
        this.updateStats();
        this.filterAppointmentsByService(this.currentService);
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching appointments:', error);
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
    // const token = this.authService.getToken(); // Token check is now implicitly handled by AdminService or not done here

    // if (!token) { // Removed explicit token check
    //   this.error = 'Authentication token is missing. Cannot fetch users. Please log in again.';
    //   this.loading = false;
    //   console.error('fetchUsers aborted: No token found.');
    //   return; 
    // }

    this.loading = true;
    this.error = '';
    
    this.adminService.getAllUsers().subscribe( // Changed to adminService and getAllUsers
      (data) => {
        this.users = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching users:', error); 
        if (error.status === 401) { 
          this.error = 'Session expired. Please log in again.'; 
          this.authService.logout(); 
          // Change all instances of '/login' to '/connexion'
          // For example:
          this.router.navigate(['/connexion']);
        } else { 
          this.error = 'Failed to load users. Please try again.'; 
        } 
        this.loading = false;
      }
    );
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    // It's crucial that if a token is required, an empty string is not sufficient.
    // The backend check `if (!token)` will treat an empty string as no token.
    // The guard in fetchUsers() is the primary defense.
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
    this.loading = true;
    this.error = '';

    // Assuming adminService will have an updateAppointment method similar to appointmentService
    // If not, this line needs to be adjusted or use appointmentService for this specific call.
    // For now, I'll assume adminService handles this too.
    this.adminService.updateAppointment(id, updatedAppointment).subscribe( // Changed to adminService
      (response) => {
        // Find the index of the appointment to update
        const index = this.appointments.findIndex(app => app._id === id);
        if (index !== -1) {
          this.appointments[index] = { ...this.appointments[index], ...response }; // Update with response from server
        }
        // Also update filteredAppointments if the updated appointment is in the current view
        const filteredIndex = this.filteredAppointments.findIndex(app => app._id === id);
        if (filteredIndex !== -1) {
          this.filteredAppointments[filteredIndex] = { ...this.filteredAppointments[filteredIndex], ...response };
        }
        
        this.updateStats(); // Recalculate stats after status change
        this.loading = false;
        // Optionally, show a success message
      },
      (error) => {
        console.error('Error updating appointment status:', error);
        this.error = `Failed to update appointment: ${error.message}`;
        this.loading = false;
      }
    );
  }

  refreshData(): void {
    this.fetchAllData(); // Changed to call fetchAllData
    // if (this.currentService === 'users') { // This logic is now inside fetchAllData
    //   this.fetchUsers();
    // }
  }

  // ... existing code ...

viewAppointment(appointment: Appointment): void {
  const updatedAppointment = {
    ...appointment,
    date: prompt('Enter notes or updates for this appointment:', appointment.date || '')
  };
  
  if (updatedAppointment.date !== null) {
    this.updateAppointmentStatus(appointment._id, updatedAppointment);
  }
}

// ... existing code ...
}
