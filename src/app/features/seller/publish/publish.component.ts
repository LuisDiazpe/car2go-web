import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
  selector: 'app-publish',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent {
  form: FormGroup;
  loading = false;
  error = '';
  success = false;

  constructor(private fb: FormBuilder, private vehicleService: VehicleService, private router: Router) {
    this.form = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      color: ['', Validators.required],
      transmission: ['Automatica', Validators.required],
      engine: ['', Validators.required],
      mileage: [null, [Validators.required, Validators.min(0)]],
      doors: ['4', Validators.required],
      plate: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      images: [''],
      fuel: ['Gasolina', Validators.required],
      topSpeed: [null, [Validators.required, Validators.min(1)]],
      contactName: ['', Validators.required],
      contactPhone: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    const imgUrl = this.form.value.images?.trim() || 'https://via.placeholder.com/400x250?text=Car2Go';
    const payload = { ...this.form.value, images: [imgUrl] };
    this.vehicleService.create(payload).subscribe({
      next: () => { this.loading = false; this.success = true; setTimeout(() => this.router.navigate(['/seller/my-vehicles']), 1500); },
      error: (e) => { this.loading = false; this.error = e?.error?.message || 'PUBLISH_ERROR'; }
    });
  }
}
