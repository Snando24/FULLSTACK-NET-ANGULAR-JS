import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  highlightSearch(text: string, searchTerm: string): string {
    if (!searchTerm || !text) {
      return text;
    }

    const regex = new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  sortArray<T>(array: T[], field: string, order: 'asc' | 'desc'): T[] {
    return [...array].sort((a, b) => {
      const aValue = this.getNestedValue(a, field);
      const bValue = this.getNestedValue(b, field);
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      const comparison = (aValue as string).toLowerCase().localeCompare((bValue as string).toLowerCase());
      return order === 'asc' ? comparison : -comparison;
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  filterArray<T>(array: T[], searchTerm: string, searchFields: string[]): T[] {
    if (!searchTerm) {
      return array;
    }

    const term = searchTerm.toLowerCase();
    return array.filter(item => 
      searchFields.some(field => {
        const value = this.getNestedValue(item, field);
        return value && value.toString().toLowerCase().includes(term);
      })
    );
  }

  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: any;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  formatErrorMessage(error: any): string {
    if (error.error && error.error.errors) {
      const validationErrors = error.error.errors;
      const firstError = Object.values(validationErrors)[0] as string[];
      if (firstError && firstError.length > 0) {
        return firstError[0];
      } else {
        return 'Error de validación en los datos enviados';
      }
    }
    
    if (error.error) {
      if (typeof error.error === 'string') {
        return error.error;
      } else if (error.error.message) {
        return error.error.message;
      } else if (error.error.title) {
        return error.error.title;
      }
    }
    
    if (error.status) {
      switch (error.status) {
        case 400:
          return 'Solicitud inválida. Verifique los datos ingresados.';
        case 404:
          return 'Cliente no encontrado.';
        case 409:
          return 'Ya existe un cliente con este RUC.';
        case 500:
          return 'Error interno del servidor. Intente nuevamente.';
        default:
          return `Error ${error.status}: ${error.statusText || 'Error desconocido'}`;
      }
    }
    
    return error.message || 'Ocurrió un error inesperado';
  }
}
