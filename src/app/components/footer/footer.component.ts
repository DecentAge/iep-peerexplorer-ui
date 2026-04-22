import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  version: string = '1.0.0';
  lastUpdate: string = new Date().toISOString();
  connected: boolean = true;
  apiEndpoint: string = 'https://api.infinity-economics.org';

  constructor() { }

  ngOnInit(): void {
    // In a real app, you would fetch this data from a service
    // Update connection status every minute
    setInterval(() => {
      this.lastUpdate = new Date().toISOString();
      // In a real app, you would check the actual connection status
      this.connected = Math.random() > 0.2; // Simulate occasional disconnections
    }, 60000);
  }
}
