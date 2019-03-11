import { OnInit, AfterContentChecked, Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { Entry } from "../shared/entry.model";
import { EntryService } from "../shared/entry.service";
import toastr from "toastr";
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';
@Component({
  selector: "app-entry-form",
  templateUrl: "./entry-form.component.html",
  styleUrls: ["./entry-form.component.css"]
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  imaskConfig = {
    mask:Number,
    scale: 2,
    thousandsSeparator:'',
    padFractionalZeros:true,
    normalizeZeros:true,
    radix:','
  };
  categories : Array<Category>;
  // ptBr = {
  //   firstDayOfWeek:0,
  //   dayN
  // };
  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    public formBuilder: FormBuilder,
    public categoryService : CategoryService
  ) {}

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  submitForm(){
    this.submittingForm = true;
    if(this.currentAction == 'new'){
      this.createEntry();
    }else{
      this.updateEntry();
    }
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  private loadCategories(){
    this.categoryService.getAll().subscribe(categories =>{
      this.categories = categories;
    })
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new") {
      this.currentAction = "new";
    } else {
      this.currentAction = "Edit";
    }
  }

  get typeOptions(): Array<any>{
    return Object.entries(Entry.types).map(([value, text])=>{
      return{
        text:text,
        value:value
      }
    })
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      description: [null],
      type: ['expanse', [Validators.required]],
      amount: [null,[Validators.required]],
      date: [null,[Validators.required]],
      paid: [true,[Validators.required]],
      categoryId: [null,[Validators.required]],
    });
  }

  private loadEntry() {
    if (this.currentAction == "Edit") {
      this.route.paramMap
        .pipe(
          switchMap(params => this.entryService.getById(+params.get("id")))
        )
        .subscribe(
          entry => {
            this.entry = entry;
            this.entryForm.patchValue(this.entry);
          },
          error => {
            alert("Ocorreu um erro no servidor");
          }
        );
    }
  }

  private setPageTitle(){
    if(this.currentAction == 'new'){
      this.pageTitle = "Cadastro de Nova Receita";
    }else{
      const entryName = this.entry.name || '';
      this.pageTitle = 'Editando Receita : ' + entryName;
    }
  }

  private createEntry(){
    const entry : Entry = Entry.fromJson(this.entryForm.value);
    this.entryService.create(entry).subscribe(entry=>{
      this.actionForSuccess(entry);
    },error=>{
      this.acationsFormError(error);
    })
  }

  private updateEntry(){
    const entry : Entry = Entry.fromJson(this.entryForm.value);
    this.entryService.update(entry).subscribe(entry=>{
      this.actionForSuccess(entry);
    },error=>{
      this.acationsFormError(error);
    })
  }

  private actionForSuccess(entry : Entry){
    toastr.success("Solicitação processada com sucesso !");

    this.router.navigateByUrl('entries',{skipLocationChange:true}).then(
      ()=> this.router.navigate(["entries",entry.id,"edit"])
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
