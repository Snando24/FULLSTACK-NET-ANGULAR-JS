import { Injectable } from '@angular/core';
import { FieldErrors, ClienteFormData } from '../models';
import { VALIDATION_RULES } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  
  validateRuc(ruc: string): { isValid: boolean; error: string } {
    if (!ruc || ruc.trim() === '') {
      return { isValid: false, error: 'required' };
    }
    
    if (ruc.length !== VALIDATION_RULES.RUC_LENGTH) {
      return { isValid: false, error: 'length' };
    }
    
    if (!/^[0-9]+$/.test(ruc)) {
      return { isValid: false, error: 'letters' };
    }
    
    return { isValid: true, error: '' };
  }

  validateRazonSocial(razonSocial: string): boolean {
    return !!(razonSocial && razonSocial.trim() !== '');
  }

  validateEmail(email: string): boolean {
    if (!email || email.trim() === '') {
      return true; // Email es opcional
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone: string): boolean {
    if (!phone || phone.trim() === '') {
      return true; // Teléfono es opcional
    }
    
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= VALIDATION_RULES.MIN_PHONE_DIGITS;
  }

  validateClienteForm(clienteData: ClienteFormData): FieldErrors {
    const errors: FieldErrors = {
      ruc: false,
      razonSocial: false,
      telefono: false,
      correo: false,
      direccion: false
    };

    // Validar RUC
    const rucValidation = this.validateRuc(clienteData.ruc);
    errors.ruc = !rucValidation.isValid;

    // Validar Razón Social
    errors.razonSocial = !this.validateRazonSocial(clienteData.razonSocial);

    // Validar Email
    errors.correo = !this.validateEmail(clienteData.correo);

    // Validar Teléfono
    errors.telefono = !this.validatePhone(clienteData.telefono);

    return errors;
  }

  hasFormErrors(errors: FieldErrors): boolean {
    return Object.values(errors).some(error => error === true);
  }
}
