import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetOrdersPageRoutingModule } from './set-orders-routing.module';

import { SetOrdersPage } from './set-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetOrdersPageRoutingModule
  ],
  declarations: [SetOrdersPage]
})
export class SetOrdersPageModule {}
