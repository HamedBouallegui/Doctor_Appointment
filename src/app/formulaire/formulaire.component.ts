import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { AppointmentService } from '../services/appointment.service';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.css']
})
export class FormulaireComponent {
  error: string = '';
  loading: boolean = false;
  successMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private appointmentService: AppointmentService
  ) {}

  submitForm(event: SubmitEvent) {
    event.preventDefault();
    this.loading = true;
    this.error = '';
    this.successMessage = '';
  
    // Get form data
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Convert FormData to a regular object
    const appointmentData: any = {};
    formData.forEach((value, key) => {
      appointmentData[key] = value;
    });
  
    console.log('Form data collected:', appointmentData);
  
    // Map form fields to match the backend appointment model
    const appointmentPayload = {
      patientName: appointmentData.fullName,
      service: appointmentData.department,
      date: appointmentData.preferredDate ? new Date(appointmentData.preferredDate).toISOString() : '',
      time: appointmentData.preferredTime,
      notes: appointmentData.symptoms || ''
    };
  
    console.log('Appointment payload:', appointmentPayload);
  
    // Validate required fields
    if (!appointmentPayload.patientName || !appointmentPayload.service || 
        !appointmentPayload.date || !appointmentPayload.time) {
      this.error = 'Please fill in all required fields';
      this.loading = false;
      return;
    }
  
    // Get auth token and verify login status
    const token = this.authService.getToken();
    console.log('Auth token exists:', !!token);
    if (!token) {
      this.error = 'You must be logged in to request an appointment';
      this.loading = false;
      // Redirect to login page
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }
  
    // Use the appointment service instead of direct HTTP call
    this.appointmentService.createAppointment(appointmentPayload)
      .subscribe(
        (response) => {
          console.log('Appointment created successfully:', response);
          this.loading = false;
          this.successMessage = 'Your appointment request has been submitted successfully!';
          form.reset();
          // Optionally redirect after a delay
          setTimeout(() => {
            this.router.navigate(['/appointments']);
          }, 2000);
        },
        (error) => {
          this.loading = false;
          console.error('Appointment submission error:', error);
          console.error('Error status:', error.status);
          console.error('Error details:', error.error);
          
          if (error.status === 401 || (error.error && error.error.msg === 'Token is not valid')) {
            this.error = 'Your session has expired. Please log in again.';
            // Redirect to login page
            localStorage.removeItem('token'); // Clear invalid token
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.error = error.error?.msg || error.error?.message || 
                        'Failed to submit appointment request. Please try again.';
          }
        }
      );
  }
}
