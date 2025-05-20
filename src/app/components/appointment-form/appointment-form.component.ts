import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  error: string = '';
  services = ['General Consultation', 'Dental Care', 'Pediatrics', 'Cardiology'];
  timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      service: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      notes: ['']
    });
  }

  ngOnInit() {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/connexion']);
      return;
    }
  }

  onSubmit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/connexion']);
      return;
    }

    if (this.appointmentForm.valid) {
      // Get user information
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        this.error = 'User information not found';
        return;
      }

      const user = JSON.parse(userStr);
      const appointmentData = {
        ...this.appointmentForm.value,
        userId: user.id,
        patientName: user.name,
        email: user.email
      };

      this.appointmentService.createAppointment(appointmentData).subscribe(
        (response) => {
          this.router.navigate(['/appointments']);
        },
        (error) => {
          this.error = error.error.message || 'Failed to create appointment';
        }
      );
    }
  }
}