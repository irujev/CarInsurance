import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss']
})
export class PartComponent implements OnInit {
  route: ActivatedRoute;
  carPart:String;

  constructor(router: ActivatedRoute) {
    this.route = router;
   }

  ngOnInit() {
    this.carPart = this.route.snapshot.paramMap.get('id');
  }


}
