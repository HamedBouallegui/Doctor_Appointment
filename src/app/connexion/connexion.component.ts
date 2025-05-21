import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent {
  activeTab: string = 'login';
  
  // Admin credentials
  private adminCredentials = {
    email: 'admin@example.com',
    password: 'admin123'
  };

  constructor(private router: Router, private authService: AuthService) {}

  switchTab(tab: string): void {
    this.activeTab = tab;
    
    // Remove active class from all tabs and forms
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    document.querySelectorAll('.form-content').forEach(form => {
      form.classList.remove('active');
    });
    
    // Add active class to selected tab and form
    const selectedTab = document.querySelector(`.tab-btn:nth-child(${tab === 'login' ? 1 : 2})`);
    if (selectedTab) {
      selectedTab.classList.add('active');
    }
    
    const selectedForm = document.querySelector(`.${tab}-form`);
    if (selectedForm) {
      selectedForm.classList.add('active');
    }
  }

  // Method to handle login form submission
  login(email: string, password: string): void {
    // Use AuthService for all authentication, including admin
    const credentials = { email, password };
    
    this.authService.login(credentials).subscribe(
      (response) => {
        // Store token and user info in localStorage is handled by AuthService
        
        // Check if user is admin and navigate accordingly
        if (response.user && response.user.role === 'admin') {
          alert('Welcome to dashboard');
          this.router.navigate(['/admin']);
        } else {
          alert('Welcome to home');
          this.router.navigate(['/']);
        }
      },
      (error) => {
        // Show invalid credentials message
        alert('Invalid credentials');
      }
    );
  }

  // Helper method to decode JWT token
  private getUserFromToken(token: string): any {
    try {
      // Split the token and get the payload part
      const payload = token.split('.')[1];
      // Decode the base64 string
      const decoded = JSON.parse(atob(payload));
      return decoded.user;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  // Method to handle signup form submission
  signup(name: string, email: string, phone: string, password: string): void {
    // Create user data object
    const userData = {
      name: name,
      email: email,
      phone: phone,
      password: password
    };

    // Call the register method from AuthService
    this.authService.register(userData).subscribe(
      (response) => {
        // Registration successful
        alert('Account created successfully! Please login.');
        this.switchTab('login'); // Switch to login tab
      },
      (error) => {
        // Registration failed
        alert(error.error.message || 'Registration failed. Please try again.');
      }
    );
  }
}
