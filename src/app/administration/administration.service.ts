import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, } from 'rxjs';
import { Order } from './order.modal';
import { v4 } from 'uuid';

import { AlertController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';


@Injectable({
  providedIn: 'root'
})
export class AdministrationService {
  orders: Order[] = [];
  percentage: number = 0;
  couriers: { email: string, name: string }[] =[];
  private orderSubject = new BehaviorSubject<Order[]>(this.orders);
  private percentageSubject = new BehaviorSubject<number>(this.percentage);
  private courierSubject = new BehaviorSubject<{ email: string, name: string }[]>(this.couriers);

  constructor(private afs: AngularFirestore,
              private alertCtrl: AlertController,
              private afstorage: AngularFireStorage) {
  }
  getPercent() {
    return this.percentageSubject.asObservable();
  }

  getOrders() {
    return this.orderSubject.asObservable();
  }

  getCouriers() {
    return this.courierSubject.asObservable();
  }


  getCouriersFromFire() {
    this.afs.collection('couriers').snapshotChanges().subscribe(couriers => {
      this.couriers = [];

      for ( const courier of couriers ) {
        this.couriers.push({ email: courier.payload.doc.data()['email'], name: courier.payload.doc.data()['name'] });
      }
      this.courierSubject.next(this.couriers);
    })
  }

  getOrdersFromFire() {
    this.afs.collection('orders').snapshotChanges().subscribe(orders => {
      this.orders = [];
      for ( const order of orders ) {

        let tempOrder = order.payload.doc.data() as Order;
        tempOrder.shippingDate = new Date(order.payload.doc.data()['shippingDate'].seconds * 1000)
        tempOrder.orderDate = new Date(order.payload.doc.data()['orderDate'].seconds * 1000)
        this.orders.push(tempOrder);
      }
      this.orderSubject.next(this.orders);
    });
  }

  uploadCSV(evt) {
    const target = evt.target
    if ( target.files.length !== 1 ) {
      this.showAlert('Please don\'t select multiple files.', 'One file at once');
      return;
    }
    if ( target.files[0].name.split('.')[target.files[0].name.split('.').length-1] !== 'csv' ) {
      this.showAlert('Please select a "csv" extended file', 'Wrong extension');
      return;
    }
    this.afstorage.ref(`${target.files[0].name}`).put(target.files[0]).percentageChanges().subscribe(r => {
      this.percentage = r;
      this.percentageSubject.next(this.percentage);
    })
  }

  showAlert(message: string, header: string) {
    this.alertCtrl.create({
      header,
      message,
      buttons: ['Okey']
    }).then(alertEl => alertEl.present());
  }

  uploadOrder(form) {
    const formValues = form.value;
    let streetName = '';
    let streetNumber = '';
    const id = v4();
    const date = new Date(formValues.orderDate)
    for ( const substring of formValues.street.split(' ') ) {
      if ( substring === formValues.street.split(' ')[formValues.street.split(' ').length - 1] ) {
        streetNumber = substring
      } else {
        if(streetName === '') {
          streetName += substring
        }
        else {
          streetName += ' ' + substring
        }
      }
      this.afs.collection('orders').doc(id).set({
        id,
        status: 'onPickUp',
        type: formValues.type,
        price: formValues.price,
        address: {
          zip: formValues.zip,
          city: formValues.city,
          street: streetName,
          number: streetNumber as unknown as number
        },
        payment: formValues.payment,
        customer: formValues.customer,
        paid: false,
        orderDate: date,
        shippingDate: new Date(date.getTime() + 3 * (1000 * 60 * 60 * 24)),
        note: formValues.note,
        courierEmail: '',
        phone: formValues.phone,
        size: {
          height: formValues.height,
          width: formValues.width,
          weight: formValues.weight,
          long: formValues.long
        }
      }).then(() => console.log('successfull'));
    }
  }

  updateCourierEmail(courier, order){
    this.afs.collection('orders').doc(order.id).update({
      courierEmail: courier
    })

  }
}
