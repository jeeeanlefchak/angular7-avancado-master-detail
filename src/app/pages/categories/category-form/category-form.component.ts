import { Component, OnInit, AfterContentChecked } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";
import {toastr} from "toastr";
@Component({
  selector: "app-category-form",
  templateUrl: "./category-form.component.html",
  styleUrls: ["./category-form.component.css"]
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    public formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  submitForm(){
    this.submittingForm = true;
    if(this.currentAction == 'new'){
      this.createCategory();
    }else{
      this.updateCategory();
    }
  }

  

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new") {
      this.currentAction = "new";
    } else {
      this.currentAction = "Edit";
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      description: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction == "Edit") {
      this.route.paramMap
        .pipe(
          switchMap(params => this.categoryService.getById(+params.get("id")))
        )
        .subscribe(
          category => {
            this.category = category;
            this.categoryForm.patchValue(this.category);
          },
          error => {
            alert("Ocorreu um erro no servidor");
          }
        );
    }
  }

  private setPageTitle(){
    if(this.currentAction == 'new'){
      this.pageTitle = "Cadastro de Nova Categoria";
    }else{
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando categoria : ' + categoryName;
    }
  }

  private createCategory(){
    const category : Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category).subscribe(category=>{
      this.actionForSuccess(category);
    },error=>{
      this.acationsFormError(error);
    })
  }

  private updateCategory(){
    const category : Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category).subscribe(category=>{
      this.actionForSuccess(category);
    },error=>{
      this.acationsFormError(error);
    })
  }

  private actionForSuccess(category : Category){
    toastr.success("Solicitação processada com sucesso !");

    this.router.navigateByUrl('categories',{skipLocationChange:true}).then(
      ()=> this.router.navigate(["categories",category.id,"edit"])
    );
  }

  private acationsFormError(error){
    toastr.error("Ocorreu um erro ao processar a solicitação");
    this.submittingForm = false;
    if(error.status === 422){
      this.serverErrorMessages = JSON.parse(error._body).errors;
    }else{
      this.serverErrorMessages = ["Falha na comunicação com o servidor, favor tente mais tarde"];
    }
  }
}
