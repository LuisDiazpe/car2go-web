import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { VehicleService } from '../../../core/services/vehicle.service';
import { StorageService } from '../../../core/services/storage.service';

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

  // Imagen
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  uploading = false;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private storageService: StorageService,
    private router: Router
  ) {
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
      fuel: ['Gasolina', Validators.required],
      topSpeed: [null, [Validators.required, Validators.min(1)]],
      contactName: ['', Validators.required],
      contactPhone: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]]
    });
  }

  /** El usuario selecciona una imagen: la guarda y muestra previsualización. */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      // Previsualización local
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';

    try {
      // 1. Si hay imagen seleccionada, subirla a Supabase y obtener el link
      let imgUrl = 'https://via.placeholder.com/400x250?text=Car2Go';
      if (this.selectedFile) {
        this.uploading = true;
        imgUrl = await this.storageService.uploadVehicleImage(this.selectedFile);
        this.uploading = false;
      }

      // 2. Crear el vehículo con la URL real de la imagen
      const payload = { ...this.form.value, images: [imgUrl] };
      this.vehicleService.create(payload).subscribe({
        next: () => { this.loading = false; this.success = true; setTimeout(() => this.router.navigate(['/seller/my-vehicles']), 1500); },
        error: (e) => { this.loading = false; this.error = e?.error?.message || 'PUBLISH_ERROR'; }
      });
    } catch (e: any) {
      this.loading = false; this.uploading = false;
      this.error = e?.message || 'IMAGE_UPLOAD_ERROR';
    }
  }
}
