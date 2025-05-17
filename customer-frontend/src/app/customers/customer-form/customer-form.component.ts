import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './customer-form.component.html',
})
export class CustomerFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  customerId?: number;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initialize form with validation
    this.form = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact_number: ['']
    });

    // Check if we are in edit mode (URL contains :id)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.customerId = +id;
        this.loadCustomer(this.customerId);
      }
    });
  }

  loadCustomer(id: number): void {
    this.customerService.getById(id).subscribe(customer => {
      this.form.patchValue({
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
        contact_number: customer.contact_number,
      });
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // show validation messages for untouched fields
      return;
    }
  
    const customerData = this.form.value;
  
    if (this.isEdit && this.customerId) {
      this.customerService.update(this.customerId, customerData).subscribe({
        next: () => {
          alert('Customer updated successfully!');
          this.router.navigate(['/customers']);
        },
        error: (err) => this.handleApiError(err),
      });
    } else {
      this.customerService.create(customerData).subscribe({
        next: () => {
          alert('Customer created successfully!');
          this.router.navigate(['/customers']);
        },
        error: (err) => this.handleApiError(err),
      });
    }
  }
  
  handleApiError(error: any) {
    console.error('API error:', error);
    if (error.status === 422 && error.error.errors) {
      const apiErrors = error.error.errors;
      // Loop over all error fields returned by the API and set them on the form controls
      Object.keys(apiErrors).forEach(field => {
        const control = this.form.get(field);
        if (control) {
          // Set a custom error key "apiError" with the first error message
          control.setErrors({ apiError: apiErrors[field][0] });
          control.markAsTouched();
        }
      });
    }
  }
}
