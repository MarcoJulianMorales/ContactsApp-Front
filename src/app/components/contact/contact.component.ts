import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  forma: FormGroup;
  listaContacts: any[] = [];

  
  constructor(
    private fb: FormBuilder,
    private _contactService: ContactService,
    //private toastr: ToastrService
    ){
      this.forma = this.fb.group({
        Id: [''],
        FechaRegistro: ['', Validators.required],
        Nombre: ['', Validators.required],
        Direccion: ['', Validators.required],
        Telefono: ['', [Validators.required, Validators.pattern("/d")]],
        CURP: ['', [Validators.required, Validators.maxLength(18), Validators.pattern("A-Za-z/d")]],
      });
    }

    ngOnInit(): void {
      this.getContacts();
    }

    resetModel(){
      this.forma.get("FechaRegistro")?.setValue("");
      this.forma.get("Id")?.setValue(0);
      this.forma.get("Nombre")?.setValue("");
      this.forma.get("Direccion")?.setValue("");
      this.forma.get("CURP")?.setValue("");
      this.forma.get("Telefono")?.setValue("");
    }

    getContacts(){
      this._contactService.getListContacts().subscribe(
        (data) => {
          console.log(data);
          this.listaContacts = data;
        },
        (error) => {
          console.log("No se ha podido obetenr los datos mi compa");
        }
      );
    }

    addContact(){
      const contact : any = {
        Nombre: this.forma.get("Nombre")?.value,
        Direccion: this.forma.get("Direccion")?.value,
        Telefono: this.forma.get("Telefono")?.value,
        CURP: this.forma.get("CURP")?.value
      };
      console.log("Contact data:", contact);
  
      this._contactService.newContact(contact).subscribe(
        (data) => {
          console.log(data);
          // console.log(data.Data.msg);
          this.getContacts();
         // this.toastr.success(data.Data.msg, 'Privilege Added!');
        },
        (error) => {
          console.log(error);
          this.getContacts();
          //this.toastr.error(error, 'Privilege not added');
        });
    }

    getContact(contact:any){
      this.forma.get("Id")?.setValue(contact.id);
      this.forma.get("Nombre")?.setValue(contact.nombre);
      this.forma.get("Direccion")?.setValue(contact.direccion);
      this.forma.get("Telefono")?.setValue(contact.telefono);
      this.forma.get("CURP")?.setValue(contact.curp);
      this.forma.get("FechaRegistro")?.setValue(contact.fechaRegistro);
    }
   
    updateContact(){
      const contact : any = {
        Id: this.forma.get("Id")?.value,
        Nombre: this.forma.get("Nombre")?.value,
        Direccion: this.forma.get("Direccion")?.value,
        Telefono: this.forma.get("Telefono")?.value,
        CURP: this.forma.get("CURP")?.value,
        FechaRegistro: this.forma.get("FechaRegistro")?.value
      };
  
      this._contactService.updateContact(contact).subscribe(
        (data) => {
          console.log(data);
          // console.log(data.Data.msg);
          this.getContacts();
          //this.toastr.success(data.Data.msg, 'Privilege edited');
        },
        (error) => {
          console.log(error);
          this.getContacts();
         // this.toastr.error(error, 'Privilege not edited');
        });
        this.resetModel();
    }

    deleteContact(){

      this._contactService.deleteContact(this.forma.get("Id")?.value).subscribe(
        (data)=> {

          console.log("contacto eliminado correctamente");
          this.getContacts();
        },
        (error) => {
          console.log(error);
          this.getContacts();
        }
      );
      this.resetModel();
    }
}
