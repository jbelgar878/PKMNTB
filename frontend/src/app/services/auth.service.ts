import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth'; // URL del backend para login
  private localStorageKey = 'userSession'; // Clave para guardar la sesión

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/validate?username=${username}&password=${password}`)
      .pipe(
        catchError(error => {
          console.error('Error en el login:', error);
          return of({ valid: false }); // Devuelve `valid: false` si hay un error
        })
      );
  }
  

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/users/register', { username, password })
      .pipe(
        catchError(error => throwError(() => error)) // Lanza el error para que pueda ser manejado en el subscribe
      );
  }
  


saveSession(username: string, userId: number, expiration: number): void {
  const sessionData = { username, userId, expiration };
  localStorage.setItem(this.localStorageKey, JSON.stringify(sessionData));
}





getSession(): { username: string | null, userId: number | null } {
  const session = localStorage.getItem(this.localStorageKey);
  if (session) {
    const { username, userId, expiration } = JSON.parse(session);
    if (Date.now() > expiration) {
      this.logout(); // Si ha expirado, eliminar sesión
      return { username: null, userId: null };
    }
    return { username, userId }; // Retornar username y userId
  }
  return { username: null, userId: null };
}

  

  logout(): void {
    localStorage.removeItem(this.localStorageKey); // Eliminar solo la clave 'userSession'
  }
}
