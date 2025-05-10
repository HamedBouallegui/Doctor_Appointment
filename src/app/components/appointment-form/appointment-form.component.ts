import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent {
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
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      patientName: ['', [Validators.required]],
      service: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      notes: ['']
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      this.appointmentService.createAppointment(this.appointmentForm.value).subscribe(
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