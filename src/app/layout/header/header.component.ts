import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userName: string;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userName = this.authService.getUser().userName;
  }

  logout(): void {
    this.authService.logout();
  }
}
