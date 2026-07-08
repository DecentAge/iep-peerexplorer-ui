import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PeerService } from '../services/peer.service';
import { Peer, PeerStats } from '../models/peer.model';

@Component({
  selector: 'app-peers',
  standalone: false,
  templateUrl: './peers.component.html',
  styleUrls: ['./peers.component.scss']
})
export class PeersComponent implements OnInit, OnDestroy {
  peers: Peer[] = [];
  stats: PeerStats | null = null;
  loading = true;
  isReloading = false;
  currentPage = 1;
  itemsPerPage = 20;
  totalNodes = 0;

  /** Node selected for the details modal (null = modal closed). */
  selectedPeer: Peer | null = null;
  searchError: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private peerService: PeerService) {}

  ngOnInit(): void {
    this.loadPeers();
    this.loadStats();
    setInterval(() => {
      this.loadPeers();
      this.loadStats();
    }, 60000);

    this.peerService.searchRequests$
      .pipe(takeUntil(this.destroy$))
      .subscribe(term => this.searchIp(term));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPeers(): void {
    this.loading = true;
    this.isReloading = true;
    this.peerService.getPeers(this.currentPage, this.itemsPerPage).subscribe({
      next: (data) => {
        // The list already carries the full peerState + geoip per node, so we keep
        // the raw objects and read them directly in the template / details modal.
        this.peers = data || [];
        this.loading = false;
        this.isReloading = false;
      },
      error: (error) => {
        console.error('Error loading peers:', error);
        this.loading = false;
        this.isReloading = false;
      }
    });
  }

  loadStats(): void {
    this.peerService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.totalNodes = data?.totalNodes || 0;
      },
      error: (error) => { console.error('Error loading statistics:', error); }
    });
  }

  changePage(page: number): void {
    if (page < 1) return;
    if (this.totalNodes && page > this.totalPages) return;
    this.currentPage = page;
    this.loadPeers();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalNodes / this.itemsPerPage));
  }

  /** Sliding window of up to 5 page numbers centred on the current page. */
  get pageWindow(): number[] {
    const size = 5;
    const total = this.totalPages;
    let start = Math.max(1, this.currentPage - Math.floor(size / 2));
    const end = Math.min(total, start + size - 1);
    start = Math.max(1, end - size + 1);
    const pages: number[] = [];
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  }

  // ---- search ----------------------------------------------------------------
  private isValidIp(ip: string): boolean {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(ip);
  }

  searchIp(ip: string): void {
    this.searchError = null;
    if (!this.isValidIp(ip)) {
      this.searchError = 'Please enter a valid IP address';
      return;
    }
    this.peerService.searchIp(ip).subscribe({
      next: (node) => {
        if (node && node._id) {
          this.selectedPeer = node;
        } else {
          this.searchError = ip + ' does not exist';
        }
      },
      error: () => { this.searchError = 'Search failed for ' + ip; }
    });
  }

  // ---- details modal ---------------------------------------------------------
  openDetail(peer: Peer): void { this.selectedPeer = peer; }
  closeDetail(): void { this.selectedPeer = null; }
  /** Open the details of another node (e.g. the feeder); fetch it if not on this page. */
  openByIp(ip?: string): void {
    if (!ip) return;
    const p = this.peers.find(x => (x._id || x.address) === ip);
    if (p) { this.selectedPeer = p; return; }
    this.searchIp(ip);
  }

  // ---- overview cell helpers -------------------------------------------------
  /** Current CPU load as a percentage of total capacity: loadAvg / cores * 100. */
  cpuPercent(peer: Peer): string {
    const ps = peer.peerState;
    if (!ps || ps.SystemLoadAverage == null || !ps.availableProcessors) return '0.00';
    return (ps.SystemLoadAverage / ps.availableProcessors * 100).toFixed(2);
  }

  cpuClass(peer: Peer): string {
    const v = parseFloat(this.cpuPercent(peer));
    if (v >= 80) return 'text-danger';
    if (v >= 50) return 'text-warning';
    return '';
  }

  /** Auto-scaled bar heights (px) for a sparkline / bar chart — relative to the max. */
  barHeights(values: number[] | undefined, chartPx: number, maxBars = 40): number[] {
    if (!values || values.length === 0) return [];
    const arr = values.slice(-maxBars);
    const max = Math.max(...arr, 0.000001);
    return arr.map(v => Math.max(1, Math.round(((v || 0) / max) * chartPx)));
  }

  /** 2-letter ISO country code -> flag emoji (regional indicator symbols). */
  flagEmoji(cc?: string): string {
    if (!cc || cc.length !== 2) return '';
    const up = cc.toUpperCase();
    const base = 0x1F1E6;
    return String.fromCodePoint(base + up.charCodeAt(0) - 65) +
           String.fromCodePoint(base + up.charCodeAt(1) - 65);
  }

  stateInfo(peer: Peer): { icon: string; title: string } {
    const ps = peer.peerState;
    if (!ps) return { icon: 'bi-dash-circle text-muted', title: 'n/a' };
    if (ps.isDownloading) return { icon: 'bi-arrow-down-circle-fill text-warning', title: 'Node is syncing (not ready)' };
    if (ps.isScanning) return { icon: 'bi-search text-warning', title: 'Node is searching nodes (not ready)' };
    return { icon: 'bi-play-fill text-dark', title: 'Node is in sync (ready)' };
  }

  hasService(peer: Peer, name: string): boolean {
    return Array.isArray(peer.services) && peer.services.includes(name);
  }

  // ---- details helpers -------------------------------------------------------
  bytesToMb(bytes?: number): string {
    if (bytes == null) return 'n/a';
    return Math.round(bytes / 1024 / 1024) + ' MB';
  }

  detailCpuLoad(peer: Peer | null): string {
    const v = peer?.peerState?.SystemLoadAverage;
    return v == null ? 'n/a' : (v * 100).toFixed(2) + '%';
  }
}
