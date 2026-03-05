import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, updateDoc, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private MAX_ATTEMPTS = 5;
  private LOCK_TIME_MINUTES = 15;

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {}

  // =========================
  // LOGIN EMAIL PASSWORD
  // =========================

  async login(data: {email: string, password: string}) {

    const email = data.email;

    // Verificar si la cuenta está bloqueada
    await this.checkIfLocked(email);

    try {

      const credential = await signInWithEmailAndPassword(
        this.auth,
        data.email,
        data.password
      );

      // Resetear intentos si el login es correcto
      await this.resetAttempts(email);

      // Registrar log
      await this.logEvent('LOGIN_SUCCESS', credential.user.uid, email, 'INFO');

      return credential;

    } catch (error) {

      // Registrar intento fallido
      await this.registerFailedAttempt(email);

      // Registrar log
      await this.logEvent('LOGIN_FAILED', null, email, 'WARN');

      throw error;
    }
  }

  // =========================
  // LOGIN GOOGLE
  // =========================

  async loginWithGoogle() {

    const provider = new GoogleAuthProvider();

    const credential = await signInWithPopup(this.auth, provider);

    await this.logEvent(
      'LOGIN_GOOGLE',
      credential.user.uid,
      credential.user.email || '',
      'INFO'
    );

    return credential;
  }

  // =========================
  // REGISTRO DE USUARIO
  // =========================

  async register(data: {email: string, password: string}) {

    const credential = await createUserWithEmailAndPassword(
      this.auth,
      data.email,
      data.password
    );

    await this.logEvent(
      'USER_REGISTERED',
      credential.user.uid,
      data.email,
      'INFO'
    );

    return credential;
  }

  // =========================
  // LOGOUT
  // =========================

  async logout() {

    const user = this.auth.currentUser;

    if (user) {
      await this.logEvent(
        'LOGOUT',
        user.uid,
        user.email || '',
        'INFO'
      );
    }

    return signOut(this.auth);
  }

  // =========================
  // VERIFICAR BLOQUEO
  // =========================

  private async checkIfLocked(email: string) {

    const safeEmail = this.getSafeEmail(email);

    const ref = doc(this.firestore, `loginAttempts/${safeEmail}`);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) return;

    const data: any = snapshot.data();

    if (data.lockedUntil && new Date(data.lockedUntil) > new Date()) {

      throw {
        code: 'auth/too-many-requests'
      };

    }
  }

  // =========================
  // REGISTRAR INTENTO FALLIDO
  // =========================

  private async registerFailedAttempt(email: string) {

    const safeEmail = this.getSafeEmail(email);

    const ref = doc(this.firestore, `loginAttempts/${safeEmail}`);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {

      await setDoc(ref, {
        count: 1,
        lockedUntil: null
      });

      return;

    }

    const data: any = snapshot.data();
    const newCount = (data.count || 0) + 1;

    if (newCount >= this.MAX_ATTEMPTS) {

      const lockTime = new Date();
      lockTime.setMinutes(lockTime.getMinutes() + this.LOCK_TIME_MINUTES);

      await updateDoc(ref, {
        count: newCount,
        lockedUntil: lockTime
      });

    } else {

      await updateDoc(ref, {
        count: newCount
      });

    }
  }

  // =========================
  // RESET DE INTENTOS
  // =========================

  private async resetAttempts(email: string) {

    const safeEmail = this.getSafeEmail(email);

    const ref = doc(this.firestore, `loginAttempts/${safeEmail}`);

    await setDoc(ref, {
      count: 0,
      lockedUntil: null
    });
  }

  // =========================
  // REGISTRO DE LOGS
  // =========================

  private async logEvent(
    action: string,
    uid: string | null,
    email: string,
    severity: string
  ) {

    const logsRef = collection(this.firestore, 'securityLogs');

    await addDoc(logsRef, {
      action,
      uid,
      email,
      severity,
      timestamp: new Date()
    });
  }

  // =========================
  // SANITIZAR EMAIL
  // =========================

  private getSafeEmail(email: string): string {
    return email.replace(/\./g, '_').replace(/@/g, '_');
  }

}