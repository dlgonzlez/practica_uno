import { Component } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, IonButton, IonHeader, IonInput, IonItem, IonContent, IonTitle, IonToolbar]
})
export class LoginPage {
  usuario = {
    correo: '',
    contra: ''
  };

  // Se deja tu IP actual de pruebas por defecto, pero es completamente editable desde la app
  ipServidor: string = '192.168.137.1';

  constructor(
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  async login() {
    if (!this.ipServidor || this.ipServidor.trim() === '') {
      this.mostrarToast('Por favor, ingresa la IP del servidor');
      return;
    }

    if (this.usuario.correo === '' || this.usuario.contra === '') {
      this.mostrarToast('Por favor, llena los datos de usuario');
      return;
    }

    const url = `http://${this.ipServidor.trim()}/api_ionic/login.php`;

    try {
      // Petición nativa mediante Capacitor para evitar bloqueos de red en Android
      const options = {
        url: url,
        headers: { 'Content-Type': 'application/json' },
        data: {
          correo: this.usuario.correo,
          contra: this.usuario.contra
        }
      };

      const response: HttpResponse = await CapacitorHttp.post(options);
      const res: any = response.data;

      if (res.success) {
        this.mostrarToast('¡Bienvenido!');
        this.router.navigate(['/home']); 
      } else {
        this.mostrarToast(res.message);
      }

    } catch (err) {
      console.error(err);
      alert('ERROR REAL: ' + JSON.stringify(err));
      this.mostrarToast(`Error al conectar con: ${url}`);
    }
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}