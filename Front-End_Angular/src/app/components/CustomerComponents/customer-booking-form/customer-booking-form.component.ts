import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Bookings } from 'src/app/models/bookings';
import { Customer } from 'src/app/models/customer';
import { Offer } from 'src/app/models/offer';
import { Room } from 'src/app/models/room';
import { AddroomService } from 'src/app/services/addroom.service';
import { AdminService } from 'src/app/services/adminservice.service';
import { CustomerService } from 'src/app/services/customer.service';
import { OfferService } from 'src/app/services/offer.service';

@Component({
  selector: 'app-customer-booking-form',
  templateUrl: './customer-booking-form.component.html',
  styleUrls: ['./customer-booking-form.component.css']
})
export class CustomerBookingFormComponent implements OnInit {

  bookingForm!: FormGroup;
  errorMessage?: string;
  successMessage?: string;

  showOffer?:boolean;
  size?:any;
  type?:any;
  Id?:any;
  booking:Bookings[]=[];
  offers?:Offer[] ;
  bookings?:Bookings;
  roomType=["Semi Delux","Delux","Luxary","Presedential suite"]
  userName?:String;
  customer?:Customer;
  room?:Room;
  Price?:number;
  // public activatedRoute:ActivatedRoute
  // this.Id = this.activatedRoute.snapshot.params['id'];
  constructor(public formBuilder:FormBuilder,public router: Router,public activatedRoute: ActivatedRoute, public customerService:CustomerService,public offerService:OfferService,public roomService:AddroomService) { }

  ngOnInit(): void {
    this.userName = this.activatedRoute.snapshot.params['userName'];
    console.log(this.userName)

    this.customerService.getCustomer(this.userName).subscribe((data)=>
    {
      this.customer = data;
      console.log(this.customer);
      console.log(this.customer.customerName);
      this.bookingForm= this.formBuilder.group({
        customerUserName : [this.userName,Validators.required],
        customerName : [this.customer.customerName,Validators.required],
        idProof : ['',Validators.required],
        email : [this.customer.email,[Validators.required,Validators.email]],
        roomType : ['',Validators.required],
        numberOfRooms : ['',Validators.required],
        numberOfMembers: ['',Validators.required],
        customerMobileno : [this.customer.mobileNumber,Validators.required],
        roomSize : ['',Validators.required],
        breakfast : ['',Validators.required],
        drinks : ['',Validators.required],
        checkInDate : ['',Validators.required],
        checkOutDate : ['',Validators.required],
        pickUpAndDrop : ['',Validators.required]
      })
    })


    // this.sendbookingForm();
  }

  sendbookingForm(){
    console.log(this.bookingForm?.value);
    this.bookings=this.bookingForm?.value;
    console.log("Bookings: "+this.bookings);
    this.customerService.bookingForm(this.bookingForm.value).subscribe(
      data => {
        this.Id = data;
        console.log(this.Id);
        if(this.bookingForm.value.pickUpAndDrop == "yes"){
          
          this.router.navigate(["addPickAndDrop", this.userName, this.Id]);

        }
        else{
          this.router.navigate(["confirmBooking", this.userName, this.Id]);
        }
      },
      error => {
        this.errorMessage = "Admit Form Cancel"
        console.log("ERROR in save : " + error);
      });
  }

  getOffers(roomType:any){
    console.log("offers called " + roomType);
    this.type = roomType;
    console.log("after" + this.type);
    console.log("AHDH"+this.size);
    this.callingOffers(this.size,this.type);

  }

  getOffersForRoomSize(roomSize:any){
    console.log("offers called by size" + roomSize)
    this.size = roomSize;
    console.log("after" + this.size);
    console.log("TYPE" +this.type)
    this.callingOffers(this.size,this.type);
  }



  callingOffers(size:any,type:any){
    if(type != undefined && size != undefined) {

      this.offerService.getOfferByRoomTypeAndRoomSize(size,type).subscribe((data)=>{
        this.roomService.getRoomByRoomTypeAndRoomSize(size,type).subscribe((data1)=>{
          console.log("Room" + data1)
          this.room = data1;
          console.log("After" + this.room.roomPrice);
          this.Price = this.room.roomPrice;
        },
        error=> {
            this.roomService.insertRoom(size,type).subscribe(()=>{
              this.roomService.getRoomByRoomTypeAndRoomSize(size,type).subscribe((data2)=>{
                this.room = data2;
                console.log("error" + this.room.roomPrice);
                this.Price = this.room.roomPrice;
                localStorage.setItem("roomPrice",""+this.room.roomPrice);
              })
            })
          }

        )
        console.log(data)
        this.offers = data;
        this.showOffer = true;
      },error=>{
        this.errorMessage = "some error occured"
        console.log(error);

        console.log(this.errorMessage);
      }

      )
    }
  }


  Back(){
    this.router.navigate(["customerDashboard", this.userName]);
  }
  next(){

  }


}
