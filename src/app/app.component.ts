import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { PeerService } from './services/peer.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'iep-peerexplorer-ui';
  isCollapsed = true;
  showSearchBar = false;
  searchTerm = '';
  networkEnvironment = 'mainnet'; // or 'testnet'
  topNode = 'Loading...';
  connectedURL = environment.apiUrl;
  version = 'Loading...';
  blockexplorerUrl = environment.blockexplorerUrl;

  constructor(private router: Router, private peerService: PeerService) {}

  ngOnInit() {
    this.loadFooterData();
    // Refresh footer data every minute
    setInterval(() => this.loadFooterData(), 60000);
  }

  loadFooterData() {
    // Get stats for version
    this.peerService.getStats().subscribe({
      next: (stats: any) => {
        this.version = stats.version || 'Unknown';
      },
      error: (error) => console.error('Error loading stats:', error)
    });

    // Get top node (node with highest rank)
    this.peerService.getTopNodeByRank().subscribe({
      next: (peers: any[]) => {
        if (peers && peers.length > 0) {
          const topPeer = peers[0];
          const rank = topPeer.peerState?.rank || 0;
          this.topNode = `${topPeer.announcedAddress || topPeer.address} (${rank.toFixed(2)})`;
        } else {
          this.topNode = 'N/A';
        }
      },
      error: (error) => {
        console.error('Error loading top node:', error);
        this.topNode = 'N/A';
      }
    });
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
