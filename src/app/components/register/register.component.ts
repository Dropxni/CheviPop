import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formReg: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  // Para mostrar / ocultar contraseña
  hide: boolean = true;
  hideConfirm: boolean = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {

    this.formReg = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  ngOnInit(): void {}

  async onSubmit() {

    if (this.formReg.invalid) {
      this.formReg.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {

      // Solo enviamos email y password al servicio
      const { email, password } = this.formReg.value;

      await this.userService.register({ email, password });

      this.router.navigate(['/login']);

    } catch (error: any) {

      console.error(error);
      this.errorMessage = this.getFirebaseErrorMessage(error.code);

    } finally {

      this.loading = false;

    }
  }

  // 🔐 Validador personalizado para confirmar contraseña
  private passwordMatchValidator(form: AbstractControl) {

    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  private getFirebaseErrorMessage(code: string): string {

    switch (code) {

      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado';

      case 'auth/invalid-email':
        return 'El formato del correo es inválido';

      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';

      default:
        return 'Ocurrió un error inesperado';
    }
  }
}