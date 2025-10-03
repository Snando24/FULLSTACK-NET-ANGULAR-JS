import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { ClienteService, ValidationService, UtilsService } from '../services';
import { Cliente, ClienteFormData, FieldErrors, SortConfig, SearchConfig } from '../models';
import { APP_CONFIG, MESSAGES } from '../constants/app.constants';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss']
})
export class ClienteListComponent implements OnInit, OnDestroy {
  // Data properties
  clientes: Cliente[] = [];
  filteredClientes: Cliente[] = [];
  selectedCliente: Cliente | null = null;

  // Form properties
  clienteData: ClienteFormData = {
    ruc: '',
    razonSocial: '',
    telefono: '',
    correo: '',
    direccion: ''
  };
  originalRuc: string = '';
  fieldErrors: FieldErrors = {
    ruc: false,
    razonSocial: false,
    telefono: false,
    correo: false,
    direccion: false
  };

  // UI state properties
  showModal: boolean = false;
  showDetails: boolean = false;
  isEdit: boolean = false;
  loading: boolean = false;
  saving: boolean = false;

  // Search and sort properties
  searchConfig: SearchConfig = {
    term: '',
    isSearching: false,
    error: ''
  };
  sortConfig: SortConfig = {
    field: '',
    order: 'asc'
  };

  // Template properties (for backward compatibility)
  get searchTerm(): string {
    return this.searchConfig.term;
  }
  set searchTerm(value: string) {
    this.searchConfig.term = value;
  }

  get searchError(): string {
    return this.searchConfig.error;
  }
  set searchError(value: string) {
    this.searchConfig.error = value;
  }

  get isSearching(): boolean {
    return this.searchConfig.isSearching;
  }
  set isSearching(value: boolean) {
    this.searchConfig.isSearching = value;
  }

  get sortBy(): string {
    return this.sortConfig.field;
  }
  set sortBy(value: string) {
    this.sortConfig.field = value;
  }

  get sortOrder(): 'asc' | 'desc' {
    return this.sortConfig.order;
  }
  set sortOrder(value: 'asc' | 'desc') {
    this.sortConfig.order = value;
  }

  // Message properties
  successMessage: string = '';
  errorMessage: string = '';
  modalError: string = '';

  // Private properties
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private clienteService: ClienteService,
    private validationService: ValidationService,
    private utilsService: UtilsService
  ) {
    this.setupSearchDebounce();
  }

  ngOnInit(): void {
    this.loadClientes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Public methods
  loadClientes(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.clienteService.getClientes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clientes) => {
          this.clientes = clientes;
          this.applyFiltersAndSort();
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = this.utilsService.formatErrorMessage(error);
          this.loading = false;
        }
      });
  }

  showAddForm(): void {
    this.resetForm();
    this.isEdit = false;
    this.showModal = true;
  }

  editCliente(cliente: Cliente): void {
    this.isEdit = true;
    this.originalRuc = cliente.ruc || '';
    this.clienteData = {
      ruc: cliente.ruc || '',
      razonSocial: cliente.razonSocial || '',
      telefono: cliente.telefono || '',
      correo: cliente.correo || '',
      direccion: cliente.direccion || ''
    };
    this.clearAllFieldErrors();
    this.clearMessages();
    
    setTimeout(() => {
      this.showModal = true;
    }, 10);
  }

  saveCliente(): void {
    this.clearAllFieldErrors();
    this.modalError = '';
    
    this.validateForm();
    
    if (this.validationService.hasFormErrors(this.fieldErrors)) {
      this.modalError = 'Por favor corrija los errores en el formulario';
      return;
    }

    this.saving = true;
    this.modalError = '';

    const cliente: Cliente = {
      ruc: this.clienteData.ruc,
      razonSocial: this.clienteData.razonSocial,
      telefono: this.clienteData.telefono || undefined,
      correo: this.clienteData.correo || undefined,
      direccion: this.clienteData.direccion || undefined
    };

    const operation = this.isEdit 
      ? this.clienteService.updateCliente(this.originalRuc, cliente)
      : this.clienteService.createCliente(cliente);

    operation.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.successMessage = this.isEdit 
          ? 'Cliente actualizado correctamente' 
          : 'Cliente creado correctamente';
        this.closeModal();
        this.loadClientes();
        this.saving = false;
        this.hideMessageAfterDelay();
      },
      error: (error) => {
        this.modalError = this.utilsService.formatErrorMessage(error);
        this.saving = false;
      }
    });
  }

  deleteCliente(ruc: string): void {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      this.errorMessage = '';
      this.clienteService.deleteCliente(ruc)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.successMessage = 'Cliente eliminado correctamente';
            this.loadClientes();
            this.hideMessageAfterDelay();
          },
          error: (error) => {
            this.errorMessage = this.utilsService.formatErrorMessage(error);
          }
        });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  showDetailsModal(cliente: Cliente): void {
    this.selectedCliente = cliente;
    this.showDetails = true;
  }

  closeDetailsModal(): void {
    this.showDetails = false;
    this.selectedCliente = null;
  }

  editFromDetails(): void {
    if (this.selectedCliente) {
      const cliente = { ...this.selectedCliente };
      this.closeDetailsModal();
      setTimeout(() => {
        this.editCliente(cliente);
      }, 100);
    }
  }

  deleteFromDetails(): void {
    if (this.selectedCliente) {
      const ruc = this.selectedCliente.ruc;
      if (confirm('¿Está seguro de eliminar este cliente?')) {
        this.closeDetailsModal();
        this.errorMessage = '';
        this.clienteService.deleteCliente(ruc)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.successMessage = 'Cliente eliminado correctamente';
              this.loadClientes();
              this.hideMessageAfterDelay();
            },
            error: (error) => {
              this.errorMessage = this.utilsService.formatErrorMessage(error);
            }
          });
      }
    }
  }

  refreshData(): void {
    this.clearSearch();
    this.loadClientes();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchError = '';
    this.applyFiltersAndSort();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onSortChange(): void {
    this.applyFiltersAndSort();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFiltersAndSort();
  }

  onRucInput(): void {
    this.validateField('ruc');
  }

  validateField(field: keyof FieldErrors): void {
    switch (field) {
      case 'ruc':
        const rucValidation = this.validationService.validateRuc(this.clienteData.ruc);
        this.fieldErrors.ruc = !rucValidation.isValid;
        break;
      case 'razonSocial':
        this.fieldErrors.razonSocial = !this.validationService.validateRazonSocial(this.clienteData.razonSocial);
        break;
      case 'correo':
        this.fieldErrors.correo = !this.validationService.validateEmail(this.clienteData.correo);
        break;
      case 'telefono':
        this.fieldErrors.telefono = !this.validationService.validatePhone(this.clienteData.telefono);
        break;
    }
  }

  // Utility methods
  trackByRuc(index: number, cliente: Cliente): string {
    return cliente.ruc;
  }

  highlightSearch(text: string): string {
    return this.utilsService.highlightSearch(text, this.searchTerm);
  }

  isRucError(errorType: string): boolean {
    const rucValidation = this.validationService.validateRuc(this.clienteData.ruc);
    return rucValidation.error === errorType;
  }

  // Private methods
  private setupSearchDebounce(): void {
    this.searchSubject
      .pipe(
        debounceTime(APP_CONFIG.DEBOUNCE_TIME),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(term => {
        this.searchTerm = term;
        this.isSearching = true;
        this.searchError = '';
        
        setTimeout(() => {
          this.isSearching = false;
          this.applyFiltersAndSort();
        }, 100);
      });
  }

  private applyFiltersAndSort(): void {
    let result = [...this.clientes];
    
    // Apply search filter
    if (this.searchTerm) {
      result = this.utilsService.filterArray(result, this.searchTerm, ['ruc', 'razonSocial']);
    }
    
    // Apply sorting
    if (this.sortBy) {
      result = this.utilsService.sortArray(result, this.sortBy, this.sortOrder);
    }
    
    this.filteredClientes = result;
  }

  private validateForm(): void {
    this.fieldErrors = this.validationService.validateClienteForm(this.clienteData);
  }

  private clearAllFieldErrors(): void {
    this.fieldErrors = {
      ruc: false,
      razonSocial: false,
      telefono: false,
      correo: false,
      direccion: false
    };
  }

  private clearMessages(): void {
    this.modalError = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  private resetForm(): void {
    this.clienteData = {
      ruc: '',
      razonSocial: '',
      telefono: '',
      correo: '',
      direccion: ''
    };
    this.originalRuc = '';
    this.clearAllFieldErrors();
    this.clearMessages();
  }

  private hideMessageAfterDelay(): void {
    setTimeout(() => {
      this.successMessage = '';
    }, APP_CONFIG.MESSAGE_DISPLAY_TIME);
  }
}