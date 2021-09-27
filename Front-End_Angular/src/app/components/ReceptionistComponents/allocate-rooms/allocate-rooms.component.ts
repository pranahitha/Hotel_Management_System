import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Bookings } from 'src/app/models/bookings';
import { ReceptionService } from 'src/app/services/reception.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-allocate-rooms',
  templateUrl: './allocate-rooms.component.html',
  styleUrls: ['./allocate-rooms.component.css']
})
export class AllocateRoomsComponent implements OnInit {

  successMessage ?: string;
  errorMessage ?: string;
  roomNumber ?:number;
  userName ?:string;
  bookingForm ?:FormGroup;
  booking ?: Bookings;
  bookedList : Bookings[] = [];
  constructor(public activedRoute:ActivatedRoute,public formBuilder:FormBuilder,public receptionService:ReceptionService,public router:Router) {

   }



  ngOnInit(): void {
   
    this.roomNumber = 1;

    this.receptionService.getBookingRooms(this.roomNumber)
    .subscribe(data =>{
      console.log(data),
      this.bookedList=data
    })

  }

  refreshPage(): void {
    this.roomNumber = 1;

    this.receptionService.getBookingRooms(this.roomNumber)
    .subscribe(data =>{
      console.log(data),
      this.bookedList=data
    })
  }

  updateCheckIn(customerUserName:string){
    this.receptionService.updateCheckInStatus(customerUserName).subscribe(() => {
      this.successMessage = "Check-In status and Payment updated successfully"
      this.refreshPage();
      this.successAlertNotification();
      this.router.navigate(['allocateRooms'])

    },error => {
      if(error == 409){
        this.errorMessage = "Insufficient Balance in " + customerUserName + " wallet, Please ask " +  customerUserName + " to Credit money "     
      this.refreshPage();
      this.router.navigate(['allocateRooms'])
      }
    })
  }

  updateCheckOut(customerUserName:string){
    localStorage.setItem("userNameForBill",customerUserName);
    this.receptionService.updateCheckOutStatus(customerUserName).subscribe(() => {
      this.successMessage = "Check-Out status and Payment updated successfully"
      this.router.navigate(['addBillPage'])
    },error => {
      if(error == 409){
      this.errorMessage = "Insufficient Balance in " + customerUserName + " wallet, Please ask " +  customerUserName + " to Credit money "
      this.refreshPage();
      }
      else{
      this.router.navigate(['addBillPage'])
      }
    })
  }

  logout(){
    this.router.navigate(['receptionistlogin'])
  }
  successAlertNotification(){
    // this.router.navigate(['receptionist'])
    Swal.fire('Success', 'Your Check-in is Successful', 'success')
   this.router.navigate(['receptionDashboard',this.bookingForm.get('receptionistId')?.value])
 }

 checkoutAlert(){
  Swal.fire('Success', 'Checked-out Successfully', 'success')
 }
}
