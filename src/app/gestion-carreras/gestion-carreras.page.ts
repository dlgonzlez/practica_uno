import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonInput, 
  IonSelect, 
  IonSelectOption, 
  IonButton,
  IonButtons,
  IonBackButton
} from '@ionic/angular';

@Component({
  selector: 'app-gestion-carreras',
  templateUrl: './gestion-carreras.page.html',
  styleUrls: ['./gestion-carreras.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonInput, 
    IonSelect, 
    IonSelectOption, 
    IonButton,
    IonButtons,
    IonBackButton
  ]
})
export class GestionCarrerasPage {

  private alertController = inject(AlertController);
  private http = inject(HttpClient);

  carrera = {
    nombre: '',
    tipo: ''
  };

async guardarCarrera() {
  if (!this.carrera.nombre.trim() || !this.carrera.tipo.trim()) {
    await this.mostrarAlerta('Aviso', 'Todos los campos marcados con (*) son obligatorios.');
    return;
  }

    // Asegúrate de colocar la ruta exacta donde guardaste guardar_carrera.php
    const url = 'http://localhost/api_ionic/guardar_carrera.php';

  this.http.post(url, this.carrera).subscribe({
    next: async (res: any) => {
      if (res.status === 'success') {
        await this.mostrarAlerta('Éxito', res.message);
        this.limpiarFormulario();
      } else if (res.status === 'duplicate' || res.status === 'warning') {
        await this.mostrarAlerta('Atención', res.message);
      } else {
        await this.mostrarAlerta('Error', res.message);
      }
    },
    error: async (err) => {
      console.error('Error HTTP:', err);
      await this.mostrarAlerta('Error de conexión', 'No se pudo conectar con el servidor backend.');
    }
  });
}

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['ACEPTAR']
    });
    await alert.present();
  }

  limpiarFormulario() {
    this.carrera = {
      nombre: '',
      tipo: ''
    };
  }
}