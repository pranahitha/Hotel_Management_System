import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-homenavbar',
  templateUrl: './homenavbar.component.html',
  styleUrls: ['./homenavbar.component.css']
})
export class HomenavbarComponent implements OnInit {

  userName?:String;
  // public activatedRoute:ActivatedRoute
  // 
  constructor(public router:Router,public activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.userName = this.activatedRoute.snapshot.params['userName'];
  }
  gotoCustomer(){
    this.router.navigate(['customerLogin',"-1"]);
  }
  contactUs(){
    this.router.navigate(['contactUs',"-1"]);
  }

}
