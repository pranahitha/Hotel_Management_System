import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { ReceptionService } from 'src/app/services/reception.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirm-booking',
  templateUrl: './confirm-booking.component.html',
  styleUrls: ['./confirm-booking.component.css']
})
export class ConfirmBookingComponent implements OnInit {
  Id?:any;
  message?:String;
  userName?:String;
  customerUserName?:string;
  price?:number;
  confirmForm?:FormGroup;
  PickupDrop?:String = "No";
  errorMessage?:string;
  // public activatedRoute:ActivatedRoute
  // this.Id = this.activatedRoute.snapshot.params['id'];
  constructor(public router : Router, public activatedRoute:ActivatedRoute, public formBuilder:FormBuilder, public customerService:CustomerService, public receptionService:ReceptionService) { }
  display = false;
  display1 = false;
  ngOnInit(): void {
    this.Id = this.activatedRoute.snapshot.params['Id'];
    this.userName = this.activatedRoute.snapshot.params['userName'];
    this.customerUserName = this.activatedRoute.snapshot.params['userName'];
    this.price =+ localStorage.getItem("roomPrice")
    console.log(this.price);
    this.confirmForm=this.formBuilder.group({

      termsAndConditions: ['', [Validators.required]],

    })
  }
  paymentDone(){
    this.display = true
  }

  cancel(){
    if(this.Id = "-1"){

      this.customerService.cancelBooking(this.Id).subscribe(
        data=>{
          console.log("delete successfully!!!", data);

          this.router.navigate(["customerDashboard", this.userName]);
        },
        error=>console.log("error got")
      )
    }
    else{
      this.customerService.cancelBooking(this.Id).subscribe(
        data=>{
          console.log("delete successfully!!!", data);

        },
        error=>console.log("error got")
      )

      this.customerService.cancelPickAndDrop(this.Id).subscribe(
        data=>{
          console.log("delete successfully!!!", data);
        },
        error=>console.log("error got")
        )
        this.router.navigate(["customerDashboard", this.userName]);
    }

  }
  final(){
    this.display1 = true;
    this.message = "your data will save and your Booking Id is:- "+this.Id;

    localStorage.setItem("bookingId",""+this.Id)
    this.receptionService.updateRoomPrice(this.customerUserName,this.price).subscribe(()=>{
      this.receptionService.updateBookedStatus(this.customerUserName).subscribe(
        ()=>{
          console.log("status updated");
          Swal.fire('Success', 'Your Room is booked Successfully!', 'success')
        },error => {
          if(error != 200){
          this.errorMessage = "Insufficient Balance in " + this.customerUserName + " wallet, Please debit money ";
        }
        
        else{
          Swal.fire('Success', 'Your Room is booked Successfully!', 'success')
        }
        })
    })

  }
  home(){
    this.router.navigate(["customerDashboard", this.userName]);
  }
}
