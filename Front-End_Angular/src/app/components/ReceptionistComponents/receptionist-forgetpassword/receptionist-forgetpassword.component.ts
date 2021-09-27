import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReceptionService } from 'src/app/services/reception.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-receptionist-forgetpassword',
  templateUrl: './receptionist-forgetpassword.component.html',
  styleUrls: ['./receptionist-forgetpassword.component.css']
})
export class ReceptionistForgetpasswordComponent implements OnInit {
  successMessage: any;
  errorMessage: any;
  receptionistForgetPassword: FormGroup
  receptionistEmail?: string;
  errorCode?:number;
  constructor(private formBuilder: FormBuilder, public router: Router, public receptionService: ReceptionService) { }

  ngOnInit(): void {
    this.receptionistForgetPassword = this.formBuilder.group({
      receptionistEmail:['',[Validators.required]],
    })
  }
forgetPassword(){
    this.receptionService.getReceptionistByEmailId(this.receptionistForgetPassword.get('receptionistEmail')?.value)
      .subscribe(
        response => {
              },
        error => {
          if(error==200){
            this.successMessage ="Your password is sent to the entered mailId successfully"
            console.log(this.receptionistForgetPassword.get('receptionistEmail')?.value);
            Swal.fire('Success', 'Your details has been successfully sent to registered mailid', 'success')
            console.log(this.successMessage)
          this.router.navigate(['receptionistlogin'])
          }
          else{
           console.log("Sorry entered mailId cant be found!");
            this.wrongLogin();
            console.log(error)
          }

        });
  }

  return(){
    this.router.navigate(['receptionistlogin'])
  }
  back(){
    this.router.navigate([''])
  }
  wrongLogin(){
    Swal.fire('Wrong!', 'Entered MailId is not registered!', 'error')
  }
  successAlertNotification(){
    // this.router.navigate(['receptionist'])
   this.router.navigate(['receptionistlogin',this.receptionistForgetPassword.get('receptionistEmail')?.value])
 
 }
}
