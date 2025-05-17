import { Component } from '@angular/core';
import { CustomerService, Customer } from '../customer.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-customer-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './customer-list.component.html',
})
export class CustomerListComponent {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm: string = '';
  isLoading = false;
  hasError = false;

  constructor(private customerService: CustomerService, public router: Router) {}

  ngOnInit() {
    this.customerService.getAll().subscribe(data => {
      this.customers = data;
      this.filteredCustomers = data;
    });
  }

  onSearchChange(): void {
    const term = this.searchTerm.trim();
    this.isLoading = true;
    this.hasError = false;
  
    if (!term) {
      this.customerService.getAll().subscribe({
        next: (data: Customer[]) => {
          this.customers = data;
          this.filteredCustomers = data;
          this.isLoading = false;
        },
        error: () => {
          this.hasError = true;
          this.isLoading = false;
        }
      });
      return;
    }
    
    this.customerService.search(term).subscribe({
      next: (data: Customer[]) => {
        this.filteredCustomers = data;
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }
  
  
  edit(customer: Customer) {
    this.router.navigate(['/customers', customer.id, 'edit']);
  }

  remove(customer: Customer) {
    if (confirm('Are you sure?')) {
      this.customerService.delete(customer.id!).subscribe(() => {
        this.customers = this.customers.filter(c => c.id !== customer.id);
        this.onSearchChange(); // refresh filtered list after deletion
      });
    }
  }
}
