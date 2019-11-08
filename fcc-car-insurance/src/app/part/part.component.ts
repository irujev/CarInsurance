import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';

class CarPart
{
    partName: string;
    partPictureUrl: string
    
    constructor( partName:string, partPictureUrl:string)
    {
      this.partName = partName;
      this.partPictureUrl = partPictureUrl;
    }
}

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.scss']
})

export class PartComponent implements OnInit {
  route: ActivatedRoute;
  carPartName:string;
  carPartPictureUrl:string;
  carPartsFiltered: Observable<CarPart[]>;
  db: AngularFireDatabase;
  carPartsListDB:AngularFireList<CarPart>;

  constructor(router: ActivatedRoute, db: AngularFireDatabase) {
    this.route = router;
    this.db = db;
  }

  ngOnInit() {
    this.carPartName = this.route.snapshot.paramMap.get('id');

    this.carPartName = this.carPartName.toLowerCase();

    if(this.carPartName == "circle_006")
    {
      this.carPartName = "circle_002";
    }
    else if(this.carPartName == "circle_012")
    {
      this.carPartName = "circle_011";
    }
    else if(this.carPartName.includes("carosserie"))
    {
      this.carPartName = "carosserie";
    }

    this.carPartsFiltered = this.db.list<CarPart>("/parts",
                          part => part.orderByChild('partName').equalTo(this.carPartName).limitToFirst(1)).valueChanges();
  }
}
