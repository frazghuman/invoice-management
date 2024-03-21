import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, SvgIconComponent],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent implements OnInit {
  showSideBar: boolean = false;
  toggleSidebar() {
    this.showSideBar = !this.showSideBar;
  }

  ngOnInit() {
    this.showSideBar = false;
  }
}
