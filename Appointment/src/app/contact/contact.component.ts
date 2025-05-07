import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  submitForm(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    
    if (form.checkValidity()) {
      // Here you would typically send the form data to your backend
      console.log('Form submitted');
      
      // Create a FormData object to easily access form values
      const formData = new FormData(form);
      const formValues: {[key: string]: string} = {};
      
      // Convert FormData to a simple object
      formData.forEach((value, key) => {
        formValues[key] = value.toString();
      });
      
      console.log('Form values:', formValues);
      
      // Show success message
      alert('Your message has been sent successfully! We will get back to you soon.');
      
      // Reset the form
      form.reset();
    } else {
      // If form is invalid, trigger browser's default validation UI
      form.reportValidity();
    }
  }
}
