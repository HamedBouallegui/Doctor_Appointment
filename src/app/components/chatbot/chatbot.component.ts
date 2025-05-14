import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChatbotService } from '../../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  
  messages: Array<{text: string, sender: 'user' | 'bot'}> = [];
  newMessage: string = '';
  isLoading: boolean = false;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    // Add initial bot message
    this.messages.push({
      text: 'Hello! How can I help you with your appointment today?',
      sender: 'bot'
    });
  }
  
  toggleChatbot(): void {
    // Emit the close event to the parent component
    this.close.emit();
  }

  sendMessage(): void {
    if (this.newMessage.trim() === '') return;
    
    // Add user message to chat
    this.messages.push({
      text: this.newMessage,
      sender: 'user'
    });
    
    const userMessage = this.newMessage;
    this.newMessage = '';
    this.isLoading = true;
    
    // Call chatbot service
    this.chatbotService.sendMessage(userMessage).subscribe({
      // Inside sendMessage() method, replace the current next callback with:
      next: (response) => {
        this.isLoading = false;
        // Extract the message from Gemini's response format
        const botReply = response.candidates && 
                        response.candidates[0]?.content?.parts[0]?.text || 
                        'Sorry, I couldn\'t process your request.';
        this.messages.push({
          text: botReply,
          sender: 'bot'
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error communicating with chatbot:', error);
        this.messages.push({
          text: 'Sorry, there was an error processing your request. Please try again later.',
          sender: 'bot'
        });
      }
    });
  }
}