import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';

// Tab3 页面：隐私与安全说明
// 这个页面主要展示应用的隐私政策和安全要求
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    CommonModule,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonTitle,
    IonToolbar
  ],
})
export class Tab3Page {
  // 注入 AlertController 用来弹窗
  constructor(private readonly alertController: AlertController) {}

  // 打开帮助弹窗
  async openHelp(): Promise<void> {
    const alert = await this.alertController.create({
      header: '帮助',
      message: '本页面用于说明库存移动应用的隐私与安全要求。',
      buttons: ['确定']
    });

    await alert.present();
  }
}
