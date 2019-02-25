import { InMemoryDbService } from "angular-in-memory-web-api";
import { Category } from './pages/categories/shared/category.model'
import { Entry } from './pages/enteris/shared/entry.model';
export class InMemoryDatabase implements InMemoryDbService {
    createDb(){
        const categories : Category[] = [
            {id:1, name: 'Lazer', description:''}
        ];

        const entries : Entry[] = [
            { id:1, name: 'Gás de cozinha', categoryId : categories[0].id, category: categories[0], paid: true , date:'19/02/2019', amount:"70,00", type:'expense', description:"", paidText:'Pago' },
            { id:1, name: 'Gás de cozinha', categoryId : categories[0].id, category: categories[0], paid: true , date:'19/02/2019', amount:"70,00", type:'revenue', description:"", paidText:'Pendente' }
        ]

        return {categories, entries};
    }
}