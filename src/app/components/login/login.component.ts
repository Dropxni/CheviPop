import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  hide: boolean = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {

    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

  }

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {

    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {

      const { email, password } = this.formLogin.value;

      await this.userService.login({ email, password });

      // login exitoso
      this.router.navigate(['/main']);

    } catch (error: any) {

      console.error('Login error:', error);

      // detectar código correctamente
      const errorCode = error?.code || error?.error?.code;

      this.errorMessage = this.getFirebaseErrorMessage(errorCode);

    } finally {

      this.loading = false;

    }
  }

  async onClick(): Promise<void> {

    this.loading = true;
    this.errorMessage = '';

    try {

      await this.userService.loginWithGoogle();
      this.router.navigate(['/main']);

    } catch (error: any) {

      console.error('Google login error:', error);
      this.errorMessage = 'Error al iniciar sesión con Google';

    } finally {

      this.loading = false;

    }
  }

  private getFirebaseErrorMessage(code?: string): string {

    switch (code) {

      case 'auth/user-not-found':
        return 'El usuario no existe';

      case 'auth/wrong-password':
        return 'Contraseña incorrecta';

      case 'auth/invalid-email':
        return 'Email inválido';

      case 'auth/invalid-credential':
        return 'Credenciales inválidas';

      case 'auth/too-many-requests':
        return 'Cuenta bloqueada temporalmente por demasiados intentos fallidos. Intenta nuevamente en 15 minutos.';

      default:
        return 'Ocurrió un error inesperado al intentar iniciar sesión';

    }

  }

}