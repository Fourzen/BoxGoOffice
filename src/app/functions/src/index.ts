import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {read, utils, WorkBook, WorkSheet} from 'xlsx';
import {Order} from './modals/order.modal';
import {v4} from 'uuid';


admin.initializeApp();


export const csvToOrders = functions.storage.object()
    .onFinalize((object) => {
      let jsonData: [][];
      if ( object.name != null ) {
        admin.storage().bucket(object.bucket).file(object.name)
            .download().then((data) => {
              const wb: WorkBook = read(data, {type: 'buffer', cellDates: true});
              const wsName: string = wb.SheetNames[0];
              const ws: WorkSheet = wb.Sheets[wsName];
              jsonData = utils.sheet_to_json(ws, {header: 1});
            makeOrder(jsonData);
            }
            );
      }

    });


const makeOrder = function(data: any) {
  const tempOrder: Order[] = [];
  for ( let i = 1; i < data.length; i++ ) {
    const order = new Order(
        v4(),
        data[i][19],
        data[i][14],
        data[i][12],
        {
          zip: data[i][4],
          city: data[i][1],
          street: data[i][2],
          number: data[i][3],
        }, data[i][10],
        data[i][0],
        data[i][9],
        new Date(data[i][8]),
        new Date(data[i][13]),
        data[i][7],
        '',
        data[i][11],
        {
          height: data[i][15],
          width: data[i][17],
          long: data[i][16],
          weight: data[i][18],
        });

    if ( data[i][5] ) {
      order.address.floor = data[i][5];
    }
    if ( data[i][6] ) {
      order.address.door = data[i][6];
    }
    console.log(order);
    tempOrder.push(order);
  }
  uploadOrder(tempOrder);
};

const uploadOrder = function(orders: Order[]) {
  for (const order of orders) {
    admin.firestore().collection('orders').doc(order.id)
        .set({
          id: order.id,
          status: order.status,
          type: order.type,
          price: order.price,
          address: {
            zip: order.address.zip,
            city: order.address.city,
            street: order.address.city,
            number: order.address.number,
          },
          payment: order.payment,
          customer: order.customer,
          paid: order.paid,
          orderDate: new Date(order.orderDate),
          shippingDate: new Date(order.shippingDate),
          note: order.note,
          courierEmail: order.courierEmail,
          phone: order.phone,
          size: {
            height: order.size?.height,
            width: order.size?.width,
            long: order.size?.long,
            weight: order.size?.weight,
          },
        }).then((r) => {
          console.log(r);
        });
    if (order.address.floor){
      admin.firestore().collection('orders').doc(order.id).update({
        address: {
          floor: order.address.floor,
          door: order.address.door,
        },
      }).then( () => {
      }).catch((error) => {
        console.log(`Address wasn't updated ${error}`);
      });
    }
  }
};

