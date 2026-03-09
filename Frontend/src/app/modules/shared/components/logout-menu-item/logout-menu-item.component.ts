import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-logout-menu-item',
  templateUrl: './logout-menu-item.component.html',
  styleUrls: ['./logout-menu-item.component.css']
})
export class LogoutMenuItemComponent {
  @Output() logout = new EventEmitter<void>();

  onLogout(): void {
    this.logout.emit();
  }
}
