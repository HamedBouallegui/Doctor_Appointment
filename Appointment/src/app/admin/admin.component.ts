import { Component } from '@angular/core';

interface AppointmentStats {
  totalAppointments: number;
  todayAppointments: number;
  pendingApproval: number;
  availableSlots: number;
}

interface Appointment {
  patientName: string;
  date: string;
  time: string;
  service: string;
  status: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  currentService: string = 'overview';

  stats: AppointmentStats = {
    totalAppointments: 150,
    todayAppointments: 25,
    pendingApproval: 10,
    availableSlots: 45
  };

  appointments: Appointment[] = [
    {
      patientName: 'John Doe',
      date: '2024-01-20',
      time: '09:00 AM',
      service: 'General Consultation',
      status: 'Pending'
    },
    {
      patientName: 'Jane Smith',
      date: '2024-01-20',
      time: '10:00 AM',
      service: 'Dental Care',
      status: 'Approved'
    },
    // Add more sample appointments as needed
  ];

  switchService(service: string) {
    this.currentService = service;
    // TODO: Implement service-specific data loading
  }

  getCurrentServiceTitle(): string {
    const titles: { [key: string]: string } = {
      overview: 'Dashboard Overview',
      general: 'General Consultation Dashboard',
      dental: 'Dental Care Dashboard',
      pediatrics: 'Pediatrics Dashboard',
      cardiology: 'Cardiology Dashboard'
    };
    return titles[this.currentService] || 'Dashboard';
  }

  // TODO: Implement methods for handling appointments
  approveAppointment(appointment: Appointment) {
    // Implementation for approving appointments
  }

  rejectAppointment(appointment: Appointment) {
    // Implementation for rejecting appointments
  }

  viewAppointment(appointment: Appointment) {
    // Implementation for viewing appointment details
  }
}
