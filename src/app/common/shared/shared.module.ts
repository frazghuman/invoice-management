import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavComponent } from '@common/components/side-nav/side-nav.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SideNavComponent
  ],
  exports: [
    SideNavComponent
  ]
})
export class SharedModule { }
