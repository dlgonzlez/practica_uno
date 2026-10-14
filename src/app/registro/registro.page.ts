import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButton, 
  IonList, 
  IonItem, 
  IonInput,
  AlertController 
} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule, 
    IonButton, 
    IonList, 
    IonItem, 
    IonInput
  ]
})
export class RegistroPage implements OnInit {
  usuario = { nombre: '', matricula: '', correo: '' };

  constructor(
    private http: HttpClient, 
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {}

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  guardarDatos() {
    if (!this.usuario.nombre.trim() || !this.usuario.matricula.trim() || !this.usuario.correo.trim()) {
      this.mostrarAlerta('Atención', 'Por favor llena todos los campos.');
      return;
    }

    const urlAPI = 'http://localhost/api_ionic/registro.php';

    this.http.post<any>(urlAPI, this.usuario).subscribe({
      next: (respuesta) => {
        if (respuesta.status === 'success') {
          this.mostrarAlerta('Éxito', respuesta.message || 'Alumno registrado con éxito.');
          this.usuario = { nombre: '', matricula: '', correo: '' };
          this.router.navigate(['/home']);
        } else if (respuesta.status === 'duplicate') {
          this.mostrarAlerta('Registro Duplicado', respuesta.message);
        } else {
          this.mostrarAlerta('Aviso', respuesta.message || 'No se pudo completar el registro.');
        }
      },
      error: (error) => {
        console.error('Error de conexión:', error);
        this.mostrarAlerta('Error de conexión', 'No se pudo establecer comunicación con el servidor.');
      }
    });
  }
}


