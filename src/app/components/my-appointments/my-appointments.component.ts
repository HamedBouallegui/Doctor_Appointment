import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.css']
})
export class MyAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/connexion']);
      return;
    }
    
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.appointmentService.getUserAppointments().subscribe(
      (appointments) => {
        this.appointments = appointments;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load appointments';
        this.loading = false;
      }
    );
  }

  cancelAppointment(id: string) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.cancelAppointment(id).subscribe(
        () => {
          this.appointments = this.appointments.filter(app => app._id !== id);
        },
        (error) => {
          this.error = 'Failed to cancel appointment';
        }
      );
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  }
}
