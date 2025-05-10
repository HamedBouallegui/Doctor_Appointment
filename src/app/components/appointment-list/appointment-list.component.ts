import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-appointment-list',
  template: `
    <div class="appointments-container">
      <h2>Appointments</h2>
      
      <div *ngIf="loading" class="loading">
        Loading appointments...
      </div>

      <div *ngIf="error" class="error">
        {{ error }}
      </div>

      <div *ngIf="!loading && !error" class="appointments-list">
        <div *ngFor="let appointment of appointments" class="appointment-item">
          <h3>{{ appointment.patientName }}</h3>
          <p>Date: {{ appointment.date }}</p>
          <p>Time: {{ appointment.time }}</p>
          <button (click)="deleteAppointment(appointment._id)">Delete</button>
        </div>
        
        <div *ngIf="appointments.length === 0" class="no-appointments">
          No appointments found
        </div>
      </div>
    </div>
  `,
  styles: [`
    .appointments-container {
      padding: 20px;
    }
    .loading, .error {
      text-align: center;
      padding: 20px;
    }
    .error {
      color: red;
    }
    .appointments-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .appointment-item {
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 4px;
    }
    .appointment-item button {
      background-color: #ff4444;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .appointment-item button:hover {
      background-color: #cc0000;
    }
    .no-appointments {
      text-align: center;
      color: #666;
      padding: 20px;
    }
  `]
})
export class AppointmentListComponent implements OnInit {
  appointments: any[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.getAppointments();
  }

  getAppointments(): void {
    this.loading = true;
    this.appointmentService.getUserAppointments()
      .subscribe(
        (data) => {
          this.appointments = data;
          this.loading = false;
        },
        (error) => {
          this.error = 'Failed to load appointments';
          this.loading = false;
          console.error(error);
        }
      );
  }

  deleteAppointment(id: string): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.cancelAppointment(id)
        .subscribe(
          () => {
            this.appointments = this.appointments.filter(a => a._id !== id);
          },
          (error) => {
            this.error = 'Failed to delete appointment';
            console.error(error);
          }
        );
    }
  }
}