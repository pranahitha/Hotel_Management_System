import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { WalletService } from 'src/app/services/wallet.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-signup',
  templateUrl: './customer-signup.component.html',
  styleUrls: ['./customer-signup.component.css']
})
export class CustomerSignupComponent implements OnInit {

  errorMessage?: string;
  successMessage?: string;
  customerSignUpForm : FormGroup;
  password :String = "";
  confirm_password :String = "";
  states = ["haryana", "delhi"];
  cities:String[]= ["a", "b"];
  st:String;

  userName?:String;
  // public activatedRoute:ActivatedRoute
  // this.userName = this.activatedRoute.snapshot.params['userName'];

  constructor(public formBuilder:FormBuilder,public router: Router,public activatedRoute: ActivatedRoute, public customerService:CustomerService, public walletService: WalletService) { }

  ngOnInit(): void {
    this.userName = this.activatedRoute.snapshot.params['userName'];
    //Model Driven FormBuilder
    this.customerSignUpForm = this.formBuilder.group({
      customerUserName : ['', [Validators.required]],
      customerName : ['',[Validators.required]],
      password : ['',[Validators.required ]],
      confirm_password : ['',[Validators.required]],
      email : ['',[Validators.required,Validators.email]],
      gender : ['', Validators.required],
      mobileNumber : ['', Validators.required],
      age : ['', Validators.required],
      city : ['', Validators.required],
      state : ['', Validators.required],
      country : ['', Validators.required],
      idProof : ['', Validators.required]
  })

  }

  saveCustomer(){
    console.log(this.customerSignUpForm.value)
    this.customerService.customerSignup(this.customerSignUpForm.value)
      .subscribe(
        response => {
          console.log(response);
          console.log(this.customerSignUpForm.value);
          console.log("SignUp Successful");
          this.successNotification();
          this.login();
          this.customerSignUpForm.reset
        },
        error => {
          console.log(error);
        })
        this.walletService.addWallet(this.customerSignUpForm.value.customerUserName, 5000).subscribe(
          response => {
            console.log(response);
            console.log("Wallet generated Successfully");
          },
          error => {
            console.log(error);
          });


        this.customerSignUpForm.reset
  }
  successNotification(){
    Swal.fire('Success', ' Signup Success!', 'success')
  }
  passwordMatch(password:String, confirm_password:String) {
    if(password===confirm_password){
      return false;
    }
    return true;

  }

  login() {

    this.router.navigate(["customerLogin", this.userName]);

  }

  Back() {

    this.router.navigate(["customerLogin", this.userName]);

  }
  showCity(st:String)
  {
    console.log(this.st)
    if(st==="haryana"){
      this.cities = ["ambala", "jirakpur"];
    }
    else if(st==="delhi"){
      this.cities = ["delhi", "new delhi"];
    }
  }
}
