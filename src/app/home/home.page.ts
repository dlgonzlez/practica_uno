import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    HttpClientModule, 
    RouterModule,
    IonButton, 
    IonHeader, 
    IonInput, 
    IonItem, 
    IonContent, 
    IonTitle, 
    IonToolbar
  ]
})
export class HomePage {
  usuario = {
    correo: '',
    contra: ''
  };

  // Variable para guardar la IP del servidor XAMPP
  ipServidor: string = 'localhost';
  
  // Bandera para controlar si ya se inició sesión y mostrar el menú
  sesionIniciada: boolean = false;

  constructor(private http: HttpClient, private toastCtrl: ToastController) {}

  login() {
    if (!this.ipServidor || this.ipServidor.trim() === '') {
      this.mostrarToast('Por favor, ingresa la IP del servidor');
      return;
    }

    if (this.usuario.correo === '' || this.usuario.contra === '') {
      this.mostrarToast('Por favor, llena los datos de usuario');
      return;
    }

    // Construir la URL dinámicamente usando la IP ingresada tal como exige el PDF
    const url = `http://${this.ipServidor.trim()}/api_ionic/login.php`;

    this.http.post(url, this.usuario).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.mostrarToast('¡Bienvenido!');
          this.sesionIniciada = true; // Cambia la vista para mostrar tu menú principal
        } else {
          this.mostrarToast(res.message);
        }
      },
      error: (err) => {
        console.error(err);
        alert('ERROR REAL: ' + JSON.stringify(err));
        this.mostrarToast(`Error al conectar con: ${url}`);
      }
    });
  }

  cerrarSesion() {
    this.sesionIniciada = false;
    this.usuario.correo = '';
    this.usuario.contra = '';
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