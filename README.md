Proyecto Angular con Firebase: Componentes de Login, Registro y Main
Este proyecto es una aplicación Angular que implementa autenticación de usuarios utilizando Firebase. Incluye tres componentes principales: Login, Register y Main.

Tabla de Contenidos
Descripción
Características
Requisitos Previos
Configuración e Instalación
Estructura del Proyecto
Uso
Recursos Adicionales
Descripción
La aplicación permite a los usuarios registrarse, iniciar sesión y acceder a una página principal protegida. La autenticación se gestiona a través de Firebase Authentication, proporcionando una integración segura y escalable.

Características
Registro de Usuarios: Los nuevos usuarios pueden crear una cuenta utilizando su dirección de correo electrónico y una contraseña.
Inicio de Sesión: Los usuarios registrados pueden autenticarse con sus credenciales.
Página Principal Protegida: Solo los usuarios autenticados pueden acceder a la página principal.
Integración con Firebase: Gestión de autenticación y almacenamiento de datos en tiempo real.
Requisitos Previos
Node.js (versión 12 o superior)
Angular CLI (versión 12 o superior)
Firebase CLI (opcional, para despliegue)
Configuración e Instalación
Clonar el Repositorio

bash
Copy
Edit
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
Instalar Dependencias

bash
Copy
Edit
npm install
Configurar Firebase

Crea un proyecto en Firebase Console.

Añade una nueva aplicación web y copia la configuración de Firebase.

Reemplaza las credenciales en el archivo src/environments/environment.ts con la configuración de tu proyecto de Firebase.

typescript
Copy
Edit
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID",
    measurementId: "TU_MEASUREMENT_ID"
  }
};
Iniciar la Aplicación

bash
Copy
Edit
ng serve
Accede a la aplicación en http://localhost:4200/.

Estructura del Proyecto
src/app/components/login/: Contiene el componente de inicio de sesión.
src/app/components/register/: Contiene el componente de registro de usuarios.
src/app/components/main/: Contiene el componente principal al que acceden los usuarios autenticados.
src/app/services/auth.service.ts: Servicio que maneja la lógica de autenticación con Firebase.
Uso
Registro de Usuario

Navega a la página de registro (/register).
Completa el formulario con un correo electrónico y una contraseña.
Haz clic en "Registrar" para crear una nueva cuenta.
Inicio de Sesión

Navega a la página de inicio de sesión (/login).
Ingresa tus credenciales y haz clic en "Iniciar Sesión".
Si las credenciales son correctas, serás redirigido a la página principal.
Acceso a la Página Principal

Una vez autenticado, puedes acceder a la página principal (/main).
Si intentas acceder a /main sin estar autenticado, serás redirigido a la página de inicio de sesión.
Recursos Adicionales
Documentación de Angular
Documentación de Firebase Authentication
Tutorial de Autenticación en Angular con Firebase
Para una guía visual sobre cómo implementar la autenticación en Angular con Firebase, puedes consultar el siguiente video: