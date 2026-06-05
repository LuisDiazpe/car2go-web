import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';
  success = false;
  hide = true;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['ROLE_BUYER', [Validators.required]]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    const { username, email, password, role } = this.form.value;
    this.auth.signUp({ username, email, password, roles: [role.replace('ROLE_', '')] }).subscribe({
      next: () => {
        this.loading = false; this.success = true;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message || 'REGISTER_ERROR';
      }
    });
  }
}
