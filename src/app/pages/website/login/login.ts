import { Component } from '@angular/core';
import { AuthService } from '../../../../service/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email: string = '' ;
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  onLogin(){
    this.authService.login(this.email, this.password).subscribe(() => {
      this.router.navigate(['/plataforma']);
    }, error =>{
      console.error('Login failed', error)
    });
  }
}
