import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { NavController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  form: FormGroup;
  constructor(private authService: AuthService,
              private navCtrl: NavController) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required)
    })
  }

  onLogin() {
    this.authService.onLogin(this.form.value.email,this.form.value.password);
  }
}
