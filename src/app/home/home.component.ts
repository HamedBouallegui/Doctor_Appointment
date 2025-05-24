import { Component, OnInit } from '@angular/core';

interface Doctor {
  name: string;
  speciality: string;
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  doctors: Doctor[] = [
    {
      name: 'Dr. Brain Adam',
      speciality: 'Cardiology',
      image: 'assets/images/download1.jpeg'
    },
    {
      name: 'Dr. Jessica Brown',
      speciality: 'Cardiology',
      image: 'assets/images/download2.jpeg'
    },
    {
      name: 'Dr. Labrien Brown',
      speciality: 'Dental',
      image: 'assets/images/download.jpeg'
    },
    {
      name: 'Dr. Noreain Waltar',
      speciality: 'Neurology',
      image: 'assets/images/images1.jpeg'
    },
    {
      name: 'Dr. Rain Adam',
      speciality: 'Pediatric',
      image: 'assets/images/images (2).jpeg'
    },
    {
      name: 'Dr. Danzel Brown',
      speciality: 'Pulmonary',
      image: 'assets/images/images (3).jpeg'
    },
    {
      name: 'Dr. Fabrien Brown',
      speciality: 'Neurology',
      image: 'assets/images/images.jpeg'
    },
    {
      name: 'Dr. Horeain Kaltar',
      speciality: 'Pulmonary',
      image: 'assets/images/images1.jpeg'
    }
  ];
  
  // Store all doctors to use when filtering
  allDoctors: Doctor[] = [];
  currentDepartment: string = 'All Department';
  
  currentSlide = 0;
  totalSlides = 3;
  
  ngOnInit() {
    // Store all doctors for filtering
    this.allDoctors = [...this.doctors];
    
    // Auto-rotate slides every 5 seconds
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
  
  // Filter doctors by department
  filterByDepartment(department: string) {
    this.currentDepartment = department;
    
    if (department === 'All Department') {
      this.doctors = [...this.allDoctors];
    } else {
      this.doctors = this.allDoctors.filter(doctor => doctor.speciality === department);
    }
  }
  
  // Check if a department button should be active
  isDepartmentActive(department: string): boolean {
    return this.currentDepartment === department;
  }
  
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlides();
  }
  
  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlides();
  }
  
  goToSlide(index: number) {
    this.currentSlide = index;
    this.updateSlides();
  }
  
  updateSlides() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach((slide, index) => {
      if (index === this.currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
    
    dots.forEach((dot, index) => {
      if (index === this.currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}

function submitAppointment() {
    // TODO: Implement appointment submission logic
    console.log('Appointment submitted');
  }

