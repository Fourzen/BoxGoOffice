import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetOrdersPage } from './set-orders.page';

const routes: Routes = [
  {
    path: '',
    component: SetOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetOrdersPageRoutingModule {}
