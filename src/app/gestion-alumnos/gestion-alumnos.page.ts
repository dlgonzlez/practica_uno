import { Component, OnInit, inject } from '@angular/core';
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

interface Carrera {
  id: string | number;
  nombre: string;
}

@Component({
  selector: 'app-gestion-alumnos',
  templateUrl: './gestion-alumnos.page.html',
  styleUrls: ['./gestion-alumnos.page.scss'],
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
export class GestionAlumnosPage implements OnInit {

  private alertController = inject(AlertController);
  private http = inject(HttpClient);

  // Lista estática con las carreras del ITP
  listaCarreras: Carrera[] = [
    { id: 1, nombre: 'Ingeniería en Tecnologías de la Información y Comunicaciones' },
    { id: 2, nombre: 'Ingeniería Industrial' },
    { id: 3, nombre: 'Ingeniería en Logística' },
    { id: 4, nombre: 'Ingeniería Mecánica' },
    { id: 5, nombre: 'Ingeniería Mecatrónica' },
    { id: 6, nombre: 'Ingeniería Eléctrica' },
    { id: 7, nombre: 'Ingeniería Electrónica' },
    { id: 8, nombre: 'Ingeniería en Gestión Empresarial' },
    { id: 9, nombre: 'Licenciatura en Administración' }
  ];

  alumno = {
    n_control: '',
    nombre: '',
    snombre: '',
    apat: '',
    amat: '',
    fecha_nac: '',
    genero: '',
    fk_caralu: ''
  };

  constructor() { }

  ngOnInit() { }

  async guardarAlumno() {
    if (!this.alumno.n_control.trim() || 
        !this.alumno.nombre.trim() || 
        !this.alumno.apat.trim() || 
        !this.alumno.amat.trim() || 
        !this.alumno.fecha_nac || 
        !this.alumno.genero || 
        !this.alumno.fk_caralu) {
      await this.mostrarAlerta('Aviso', 'Todos los campos marcados con (*) son obligatorios.');
      return;
    }

    const fechaNacimiento = new Date(this.alumno.fecha_nac);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mesDiff = hoy.getMonth() - fechaNacimiento.getMonth();
    
    if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    if (edad < 12) {
      await this.mostrarAlerta('Edad no válida', 'La edad mínima permitida es de 12 años.');
      return;
    }

    if (edad > 100) {
      await this.mostrarAlerta('Edad no válida', 'La edad máxima permitida es de 100 años.');
      return;
    }

    const url = 'http://localhost/api_ionic/guardar_alumno.php';

    this.http.post(url, this.alumno).subscribe({
      next: async (res: any) => {
        if (res.status === 'success') {
          await this.mostrarAlerta('Éxito', res.message);
          this.limpiarFormulario();
        } else if (res.status === 'duplicate') {
          await this.mostrarAlerta('Número de control duplicado', res.message);
        } else {
          await this.mostrarAlerta('Error', res.message);
        }
      },
      error: async () => {
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
    this.alumno = {
      n_control: '',
      nombre: '',
      snombre: '',
      apat: '',
      amat: '',
      fecha_nac: '',
      genero: '',
      fk_caralu: ''
    };
  }
}