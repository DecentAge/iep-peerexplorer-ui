import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Peer, PeerStats } from '../models/peer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeerService {
  private apiUrl: string;
  private peerEndPoint: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl || '';
    this.peerEndPoint = 'api/nodes';
  }

  getPeers(page: number, results: number): Observable<Peer[]> {
    const params = {
      page: page.toString(),
      results: results.toString(),
      filter: 'numberOfActivePeers',
      order: 'desc'
    };

    return this.http.get<Peer[]>(`${this.apiUrl}${this.peerEndPoint}`, { params });
  }

  getStats(): Observable<PeerStats> {
    // For development, return mock data
    // In production, this would call the actual API
    return of({
      connectedPeers: Math.floor(Math.random() * 200) + 50, // random between 50-250
      totalPeers: Math.floor(Math.random() * 500) + 200,    // random between 200-700
      maxPeers: 1000,
      lastUpdate: new Date().toISOString()
    }).pipe(
      catchError(this.handleError<PeerStats>('getStats', {
        connectedPeers: 0,
        totalPeers: 0,
        maxPeers: 0,
        lastUpdate: new Date().toISOString()
      }))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}
