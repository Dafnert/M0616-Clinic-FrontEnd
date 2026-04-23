import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { userService } from '../services/user.service';
import { Router } from '@angular/router';
import { user } from '../models/user';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})


export class ProfileComponent implements OnInit {
  user: user = new user();
  id!: number;
 constructor(
    private _userService: userService,
    private router: Router
  ) {}
ngOnInit(): void {
  const storedId = localStorage.getItem('id');
}
}
