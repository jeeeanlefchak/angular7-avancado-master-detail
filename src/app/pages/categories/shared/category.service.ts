import { Injectable } from '@angular/core';
import { Category } from './category.model';
import { BaseResourceService } from 'src/app/shared/service/base-resource.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseResourceService<Category>{


  constructor(protected http : HttpClient) { 
    super("api/categories", http);
  }

  

  
}
