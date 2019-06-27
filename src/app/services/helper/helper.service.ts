import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor( public toastController: ToastController) { }

  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      animated: true,
      duration: 1000
    });
    toast.present();
  }

  async showSuccessToast(msg) {
    const toast = await this.toastController.create({      
      message: msg,
      animated: true,
      duration: 1000
    });
    toast.present();
  }

  async showUpdateToast() {
    const toast = await this.toastController.create({      
      message: 'Es ist eine neue Version verfügbar.',
      animated: true,      
      buttons: [
        {
          side: 'end',
          icon: 'refresh',
          text: 'Neu laden',
          handler: () => {
            window.location.reload();
          }
        }]
    });
    toast.present();
  }
}
