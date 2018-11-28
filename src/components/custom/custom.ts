import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'custom',
  templateUrl: 'custom.html'
})
export class CustomComponent implements OnInit  {

  @Input() value : any;

  constructor() {
    
  }

  ngOnInit(): void {
    console.log({value: this.value});
  }

  ngOnDestroy() {
    console.log("custom component destroyed");
  }

}
