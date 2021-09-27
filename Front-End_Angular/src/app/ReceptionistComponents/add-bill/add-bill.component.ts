import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Bookings } from 'src/app/models/bookings';
import { Offer } from 'src/app/models/offer';
import { OfferService } from 'src/app/services/offer.service';
import { ReceptionService } from 'src/app/services/reception.service';
import { ReceptionistService } from 'src/app/services/receptionist.service';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.css']
})
export class AddBillComponent implements OnInit {

  billBeforeDiscount:number=0;
  successMessage?:string;
  errorMessage?:string
  addBill?:FormGroup;
  userName?:string;
  bookings?:Bookings;
  totalBill?:number;
  roomBill?:number;
  discount?:number;
  breakFastBill?:number;
  drinksBill?:number;
  foodBill?:number;
  pickUpDropBill?:number;
  offers:Offer[] = [];
  constructor(public offerService:OfferService, public formBuilder:FormBuilder, public router: Router,public receptionService:ReceptionService) { }

  ngOnInit(): void {
    
    this.userName = localStorage.getItem("userNameForBill");
    this.receptionService.getRecordByUserName(this.userName).subscribe((data)=>{
      console.log(data)

    this.bookings = data;
 
    this.offerService.getOfferByRoomTypeAndRoomSize(this.bookings.roomSize,this.bookings.roomType).subscribe((data) => {
      //this.offers = data;
      this.offers = data;
      this.discount = this.offers[0].discountPercentage;
      
  

    })
    
    this.addBill = this.formBuilder.group({
   
      customerUserName:[this.userName,[Validators.required]],
      roomBill:[this.bookings.roomPrice,[Validators.required]],
      discount:[25],
      breakFastBill:['',[Validators.required]],
      drinksBill:['',[Validators.required]],
      foodBill:['',[Validators.required]],
      pickUpDropBill:['',[Validators.required]],
      totalBill:['',Validators.required]
    })
    

   
  })
  }
demo(){
 this.billBeforeDiscount =this.roomBill+this.pickUpDropBill+this.breakFastBill+this.drinksBill+this.foodBill
 this.totalBill=(this.discount*this.billBeforeDiscount)/100;
}

  
  addBillfunction(){
    console.log(this.addBill.value)
    this.receptionService.addBill(this.addBill.value).subscribe(
      response =>{
        this.successMessage = "Bill added successfully"
        this.router.navigate(['addBillPage'])
      },error => {
        this.errorMessage = "some error occured,Please try again later";
        this.router.navigate(['addBillPage'])
      }
    )
  }

  logout(){

  }

}
