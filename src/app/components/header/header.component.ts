import { Component, OnInit } from '@angular/core';
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  faAlignLeft = faAlignLeft

  constructor() { }

  ngOnInit() {
  }

}
