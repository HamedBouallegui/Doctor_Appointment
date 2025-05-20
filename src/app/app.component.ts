import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Appointment';
  showChatbot = false;
  isAdminPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAdminPage = event.url.includes('/admin');
        if (this.isAdminPage) {
          this.showChatbot = false;
        }
      }
    });
  }
  
  toggleChatbot() {
    if (!this.isAdminPage) {
      this.showChatbot = !this.showChatbot;
    }
  }
}
