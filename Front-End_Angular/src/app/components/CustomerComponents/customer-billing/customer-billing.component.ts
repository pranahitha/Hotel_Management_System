import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReceptionService } from 'src/app/services/reception.service';
import { Bookings } from 'src/app/models/bookings';
import { Bill } from 'src/app/models/bill';

@Component({
  selector: 'app-customer-billing',
  templateUrl: './customer-billing.component.html',
  styleUrls: ['./customer-billing.component.css']
})
export class CustomerBillingComponent implements OnInit {

  paymentForm : FormGroup;
  errorMessage?: string;
  successMessage?: string;
  Id?:number;
  userName?:String;
  booking:Bookings;
  bills?:Bill[] = [];
  totalBill?:number;
  roomBill?:number;
  discount?:number;
  billNo?:number;
  breakFastBill?:number;
  drinksBill?:number;
  foodBill?:number;
  pickUpDropBill?:number;
  customerUserName?:string;
  // bills : Bill[]
  // <p>Bill No </p>
  // <p>User Name</p>
  // <p>Room Bill</p>
  // <p>BreakfastBill</p>
  // <p>Drinks Bill</p>
  // <p>Food Bill </p>
  // <p>Pickup And Drop Bill </p>
  // <p>Total Bill</p>
  @ViewChild('htmlData') htmlData:ElementRef;
  USERS = [
    {
      "Bill No ": 12000,
      "User Name": "Loki18",
      "Room Bill": "PCM",
      "Breakfast Bill": 2311111,
      "Drinks Bill": 90,
      "Food Bill": 0,
      "Pickup And Drop Bill": "Your Whole property",
      "Total Bill": "And Kidney too",


    }

  ];
  constructor(public customerService: CustomerService,public receptionService:ReceptionService, public router: Router,public activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.userName = this.activatedRoute.snapshot.params['userName'];
    this.customerUserName = this.activatedRoute.snapshot.params['userName'];
    this.receptionService.getRecordByUserName(this.customerUserName).subscribe((data)=>{
        console.log(data);
      this.booking = data;

    })
    this.viewBillHistory();
  }

  viewBillHistory(){

    this.customerService.viewBill(this.customerUserName).subscribe((data)=>{
      this.bills = data;

      this.discount = this.bills[0].discount;
      this.breakFastBill = this.bills[0].breakfastBill;
      this.pickUpDropBill = this.bills[0].pickupAndDropBill;
      this.foodBill = this.bills[0].foodBill;
      this.drinksBill = this.bills[0].drinksBill;
      this.roomBill = this.bills[0].roomBill;
      this.billNo = this.bills[0].billNo;
      this.totalBill = this.bills[0].totalBill;
    },error => {
      this.errorMessage = "Billing is not generated yet for your account";
      this.router.navigate(["billing",this.userName])
    })
  }
  Back(){

    this.router.navigate(["customerDashboard", this.userName]);

  }
  PaymentDone(){

  }



public openPDF():void {
  let DATA = document.getElementById('htmlData');

  html2canvas(DATA).then(canvas => {

      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;

      const FILEURI = canvas.toDataURL('image/png')
      var PDF = new jsPDF('p','mm','a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)

      PDF.save('Invoice.pdf');
  });
}
}
