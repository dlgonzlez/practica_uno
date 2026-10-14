import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, home } from 'ionicons/icons';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton]
})
export class DetallesPage implements OnInit {

  constructor() {
    addIcons({ heart, home });
  }

  ngOnInit() { }
}