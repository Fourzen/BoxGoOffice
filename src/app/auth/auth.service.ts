import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  constructor(private fireAuth: AngularFireAuth,
              private navCtrl: NavController) { }

  LoggedIn():boolean {
    return this.isLoggedIn;
  }

  onLogin(email: string, password: string){
    this.fireAuth.signInWithEmailAndPassword(email, password).then(r => {
      this.isLoggedIn = true;
      this.navCtrl.navigateForward('/administration');
    });

  }
}
