import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdministrationService } from './administration.service';
import { Subscription } from 'rxjs';
import { Order } from './order.modal';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import validate = WebAssembly.validate;
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.page.html',
  styleUrls: ['./administration.page.scss'],
})
export class AdministrationPage implements OnInit, OnDestroy {
  percentage: number;
  couriers: {name: string, email:string}[] ;
  form: FormGroup;
  order: Order;
  orders: Order[];
  page: string = '';
  private courSub: Subscription;
  private ordersSub: Subscription;
  private percentSub: Subscription;
  constructor(private adminService: AdministrationService,
              private authService: AuthService) { }

  ngOnInit() {
    this.form = new FormGroup({
      customer: new FormControl(null, Validators.required),
      price: new FormControl(0),
      type: new FormControl('mail', Validators.required),
      payment: new FormControl('transfer', Validators.required),
      orderDate: new FormControl(null, Validators.required),
      note: new FormControl(null),
      email: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      street: new FormControl(null, Validators.required),
      zip: new FormControl(null, [Validators.minLength(4), Validators.maxLength(6)]),
      height : new FormControl(null),
      weight : new FormControl(null),
      width : new FormControl(null),
      long : new FormControl(null)

    })
    this.percentSub = this.adminService.getPercent().subscribe(r => {
      this.percentage = r;
    });
    this.ordersSub = this.adminService.getOrders().subscribe(orders => {
      this.orders = orders;
    });
    this.courSub = this.adminService.getCouriers().subscribe(couriers => {
      this.couriers = couriers ;
    });
    this.adminService.getCouriersFromFire();
    this.adminService.getOrdersFromFire()
  }
  uploadOrder(){
    this.adminService.uploadOrder(this.form);
  }

  uploadCSV($event: Event) {
    this.adminService.uploadCSV($event);
  }
  isAuthenticated(){
    return this.authService.LoggedIn();
  }

  ngOnDestroy(){
    if(this.courSub)
      this.courSub.unsubscribe();
    if(this.ordersSub)
      this.ordersSub.unsubscribe();
    if(this.percentSub)
      this.percentSub.unsubscribe();
  }
}


