import { Injectable } from '@angular/core';
import { Food } from '../shared/models/Food';
import { sample_foods } from '../../data';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FOODS_BY_ID_URL, FOODS_BY_SEARCH_URL, FOODS_URL } from '../shared/constants/urls';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http:HttpClient) { }

  getAll():Observable<Food[]>{
    return this.http.get<Food[]>(FOODS_URL);
  }

  getAllFoodsBySearchTerm(searchTerm:string){
    return this.http.get<Food[]>(FOODS_BY_SEARCH_URL + searchTerm);
  }

  getFoodById(foodId:string):Observable<Food>{
    return this.http.get<Food>(FOODS_BY_ID_URL + foodId);
  }
}
