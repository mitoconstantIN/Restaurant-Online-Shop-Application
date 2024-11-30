import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Food } from '../../../shared/models/Food';
import { FoodService } from '../../../services/food.service';
import { SearchComponent } from "../../partials/search/search.component";
import { NotFoundComponent } from "../../partials/not-found/not-found.component";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchComponent, NotFoundComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent {
  foods: Food[] = [];

  constructor(private foodService:FoodService, activatedRoute:ActivatedRoute) {
    let foodsObservable:Observable<Food[]>;

    activatedRoute.params.subscribe((params) => {
      if(params.searchTerm)
        foodsObservable=this.foodService.getAllFoodsBySearchTerm(params.searchTerm);
      else
        foodsObservable = foodService.getAll();

        foodsObservable.subscribe((serverFoods) =>{
          this.foods = serverFoods;
        })
    });
  }
}
