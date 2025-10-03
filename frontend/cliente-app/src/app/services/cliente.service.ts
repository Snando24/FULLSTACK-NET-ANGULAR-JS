import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Cliente } from '../models';
import { APP_CONFIG } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = APP_CONFIG.API_URL;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getClienteByRuc(ruc: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${ruc}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  searchByRazonSocial(razonSocial: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/search?razonSocial=${encodeURIComponent(razonSocial)}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateCliente(ruc: string, cliente: Cliente): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ruc}`, cliente, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  partialUpdateCliente(ruc: string, cambios: Partial<Cliente>): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.apiUrl}/${ruc}`, cambios, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteCliente(ruc: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${ruc}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocurrió un error inesperado';
    
    if (error.error && error.error.errors) {
      const validationErrors = error.error.errors;
      const firstError = Object.values(validationErrors)[0] as string[];
      if (firstError && firstError.length > 0) {
        errorMessage = firstError[0];
      } else {
        errorMessage = 'Error de validación en los datos enviados';
      }
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.error && typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status) {
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud inválida. Verifique los datos ingresados.';
          break;
        case 404:
          errorMessage = 'Cliente no encontrado';
          break;
        case 409:
          errorMessage = 'Ya existe un cliente con este RUC';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.statusText || 'Error desconocido'}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
