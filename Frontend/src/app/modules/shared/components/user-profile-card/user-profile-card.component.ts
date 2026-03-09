import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-profile-card',
  templateUrl: './user-profile-card.component.html',
  styleUrls: ['./user-profile-card.component.css']
})
export class UserProfileCardComponent {
  @Input() name = 'Cristian Jonhson';
  @Input() email = 'cristian.jonhson@gmail.com';
}
