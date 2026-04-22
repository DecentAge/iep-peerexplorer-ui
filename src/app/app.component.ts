import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'iep-peerexplorer';
  isCollapsed = true;
  showSearchBar = false;
  searchTerm = '';
  networkEnvironment = 'mainnet'; // or 'testnet'
  topNode = 'Loading...';
  connectedURL = 'Loading...';
  version = '1.0.0';

  constructor(private router: Router) {}

  ngOnInit() {
    // In a real app, these values would be fetched from a service
    setTimeout(() => {
      this.topNode = '123.456.789.0';
      this.connectedURL = 'https://api.infinity-economics.org';
      this.version = '1.0.0';
    }, 1000);
  }

  search() {
    if (this.searchTerm) {
      // In a real app, this would navigate to a search results page or filter the peers
      console.log('Searching for:', this.searchTerm);
      this.router.navigate(['/'], { queryParams: { search: this.searchTerm } });
      this.searchTerm = '';
      this.showSearchBar = false;
    }
  }
}
