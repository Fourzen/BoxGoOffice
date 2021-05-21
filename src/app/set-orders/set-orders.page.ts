import { Component, OnInit } from '@angular/core';
import { Order } from '../administration/order.modal';
import {  Subscription } from 'rxjs';
import { AdministrationService } from '../administration/administration.service';

@Component({
  selector: 'app-set-orders',
  templateUrl: './set-orders.page.html',
  styleUrls: ['./set-orders.page.scss'],
})
export class SetOrdersPage implements OnInit {
  orders: Order[] = [];
  orderSub: Subscription;
  couriers: { email: string, name: string }[] = [];
  courierSub: Subscription;
  constructor(private adminService: AdministrationService) { }

  ngOnInit() {
    this.orderSub = this.adminService.getOrders().subscribe(orders => {
      this.orders = [];
      this.orders = orders;
      console.log(this.orders)

    });
    this.courierSub = this.adminService.getCouriers().subscribe(couriers => {
      this.couriers = couriers;
    });
    this.adminService.getOrdersFromFire();
    this.adminService.getCouriersFromFire();
  }

  onChooseCourier(evt, order) {
    this.adminService.updateCourierEmail(evt.target.value, order)
  }

  getCourier(order) {
    for(const courier of this.couriers){
      if(courier.email === order.courierEmail){
        return courier.name;
      }
    }
  }
  ngOnDestroy(){
    if(this.courierSub){
      this.courierSub.unsubscribe()
    }
    if(this.orderSub){
      this.orderSub.unsubscribe()
    }
  }
}

