import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cancel-booking',
  templateUrl: './cancel-booking.component.html',
  styleUrls: ['./cancel-booking.component.css']
})
export class CancelBookingComponent implements OnInit {
  cancelBooking: FormGroup;
  errorMessage?:String;
  bookingId? : number;
  userName?:String;
  // public activatedRoute:ActivatedRoute
  // this.Id = this.activatedRoute.snapshot.params['id'];

  constructor(public formBuilder:FormBuilder, public router:Router,public customerService:CustomerService, public activatedRoute:ActivatedRoute) {
  }

  ngOnInit(): void {
    this.bookingId =+ localStorage.getItem("bookingId")
    console.log(this.bookingId)
    this.userName = this.activatedRoute.snapshot.params['userName'];
    this.cancelBooking = this.formBuilder.group({
      //bookingId : [this.bookingId, Validators.required],
      customerUserName : [this.userName, Validators.required],
      reason : ['', Validators.required]
    })

  }
  sendCancelBooking(data: any){
    console.log(this.cancelBooking?.value);
    
  
    this.customerService.updateCancellationStatus(this.userName,"yes")

    // this.customerService.cancelBooking(data.bookingId)
      .subscribe(
        response => {
          console.log(response);
          // this.successMessage = doctorId +" :   successfully deleted";
          Swal.fire('Success', ' Request send successfully!', 'success')
          console.log("#######Deleted successfully ");
        },
        error => {
       
          Swal.fire('Success', ' Request send successfully!', 'success')
          console.log(error);
          this.router.navigate([''])
        //   Swal.fire('Success', 'Your login is successfull', 'success')
        // this.router.navigate(['customerDashboard', this.userName])

        });
  }

  Back(){
    this.router.navigate(["customerDashboard", this.userName]);
  }



}
