import { Routes } from '@angular/router';
import { ClienteListComponent } from './components/cliente-list.component';

export const routes: Routes = [
  { path: '', component: ClienteListComponent },
  { path: 'clientes', component: ClienteListComponent },
  { path: '**', redirectTo: '' }
];