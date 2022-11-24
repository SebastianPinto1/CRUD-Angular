import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  freshnessList = ["Nuevo", "Segunda Mano", "Revisado"];
  productForm !: FormGroup; 
  actionBtn : string = "Guardar"
  constructor(private formBuilder : FormBuilder,
     private api : ApiService, 
     @Inject(MAT_DIALOG_DATA) public editData : any,
     private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName : ['', Validators.required],
      category : ['', Validators.required],
      estado : ['', Validators.required],
      precio:['', Validators.required],
      comentario:['',Validators.required],
      date : ['', Validators.required]

    });

    if(this.editData){
      this.actionBtn="Actualizar";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['estado'].setValue(this.editData.estado);
      this.productForm.controls['precio'].setValue(this.editData.precio);
      this.productForm.controls['comentario'].setValue(this.editData.comentario);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
    

  }
  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next:(res)=>{
            alert("Producto agregado exitosamente")
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            alert("Error producto no agregado")
          }
        })
      }
    }else{
      this.updateProduct()
    }
  }
  updateProduct() {
    this.api.putProduct(this.productForm.value,this.editData.id)
    .subscribe({
      next: (res)=>{
      alert("Producto actualizado correctamente");
      this.productForm.reset();
      this.dialogRef.close('update');
    },
    error:()=>{
      alert("error al actualizar el registro");
    }
    })
  }
}
