import { Component, OnInit } from '@angular/core';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  isLoading: boolean = false;
  isSuccess: boolean = false;
  errorMessage: string = '';

  ngOnInit() {
    // Initialize EmailJS with your public key
    emailjs.init('AiGUj6pwUEDVlS_b-'); // Your EmailJS public key
  }

  submitForm(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    if (form.checkValidity()) {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Create a FormData object
      const formData = new FormData(form);
      
      // Create template parameters object with correct mapping
      const templateParams = {
        from_name: formData.get('from_name'),
        reply_to: formData.get('user_email'),
        message: formData.get('message'),
        subject: formData.get('subject'),
        // Add any other fields your template needs
      };
      
      // Send email using EmailJS with your specific template and service
      emailjs.send(
        'service_v7d5vio', // Your EmailJS service ID
        'template_jozce0f', // Your EmailJS template ID
        templateParams,
        'AiGUj6pwUEDVlS_b-' // Your EmailJS public key
      )
      .then((response) => {
        console.log('Email sent successfully:', response);
        this.isLoading = false;
        this.isSuccess = true;
        
        // Reset the form
        form.reset();
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          this.isSuccess = false;
        }, 5000);
      })
      .catch((error) => {
        console.error('Email sending failed:', error);
        this.isLoading = false;
        this.errorMessage = 'Failed to send your message. Please try again later.';
      });
    } else {
      // If form is invalid, trigger browser's default validation UI
      form.reportValidity();
    }
  }
}