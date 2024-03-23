import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { RouterModule } from '@angular/router';
import { BackdropService } from '@common/services/signals/backdrop.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, SvgIconComponent],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent implements OnInit {
  backDropService = inject(BackdropService);
  showSideBar: boolean = false;
  toggleSidebar() {
    this.showSideBar = !this.showSideBar;
    this.backDropService.set('visible', this.showSideBar);
  }

  ngOnInit() {
    this.showSideBar = false;
  }
}
