import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BotService } from 'src/app/services/bot.service';

@Component({
  selector: 'app-bibliochat',
  templateUrl: './bibliochat.component.html',
  styleUrls: ['./bibliochat.component.css']
})
export class BibliochatComponent implements OnInit {
  @ViewChild('mensaje2') myNameElem!: ElementRef;

  constructor(private botservice: BotService) {

  }

  ngOnInit(): void {

  }

  senMessage() {


  }

}
