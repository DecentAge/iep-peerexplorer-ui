import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeersComponent } from './peers/peers.component';

const routes: Routes = [
  { path: '', redirectTo: '/peers', pathMatch: 'full' },
  { path: 'peers', component: PeersComponent },
  // Weitere Routen hier hinzufügen
  { path: '**', redirectTo: '/peers' } // Catch-all Route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
