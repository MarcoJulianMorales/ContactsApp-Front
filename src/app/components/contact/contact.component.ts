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
  busqueda: boolean = false;
  criterioBusqueda: string= 'Id';
  
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
        campoBusqueda: ['', Validators.required]
      });
    }

    ngOnInit(): void {
      this.getContacts();
    }

    resetModel(){
      this.forma.get("FechaRegistro")?.setValue("");
      this.forma.get("Id")?.setValue("");
      this.forma.get("Nombre")?.setValue("");
      this.forma.get("Direccion")?.setValue("");
      this.forma.get("CURP")?.setValue("");
      this.forma.get("Telefono")?.setValue("");
    }

    changeCriteria(criteria:any){
      this.criterioBusqueda= '' + criteria;
      console.log(this.criterioBusqueda);
      this.resetModel();
    }

    //Metodos CRUD

    getContacts(){
      this.busqueda=false;
      this.resetModel();
      this._contactService.getListContacts().subscribe(
        (data) => {
          console.log(data);
          this.listaContacts = data;
        },
        (error) => {
          console.log("No se ha podido obetenr los datos");
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
      let id = this.forma.get("Id")?.value;
      this._contactService.deleteContact(id).subscribe(
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

    //Metodos de Busqueda
    search(){
      let campoBusqueda = this.forma.get("campoBusqueda")?.value;

      switch(this.criterioBusqueda){
        case 'Id' :{
          this._contactService.searchById(campoBusqueda).subscribe(
            (data) => {
              console.log(data);
              this.listaContacts = data;
              this.busqueda=true;
            },
            (error) =>{
              console.log("No se ha podido obetenr los datos");
            }
          );
          break;
        }
        case 'Nombre' :{
          this._contactService.searchByNombre(campoBusqueda).subscribe(
            (data) => {
              console.log(data);
              this.listaContacts = data;
              this.busqueda=true;
            },
            (error) =>{
              console.log("No se ha podido obetenr los datos");
            }
          );
          break;
        }
        case 'Teléfono' :{
          this._contactService.searchByTelefono(campoBusqueda).subscribe(
            (data) => {
              console.log(data);
              this.listaContacts = data;
              this.busqueda=true;
            },
            (error) =>{
              console.log("No se ha podido obetenr los datos");
            }
          );
          break;
        }
        case 'Dirección' :{
          this._contactService.searchByDireccion(campoBusqueda).subscribe(
            (data) => {
              console.log(data);
              this.listaContacts = data;
              this.busqueda=true;
            },
            (error) =>{
              console.log("No se ha podido obetenr los datos");
            }
          );
          break;
        }
        case 'CURP' :{
          this._contactService.searchByCURP(campoBusqueda).subscribe(
            (data) => {
              console.log(data);
              this.listaContacts = data;
              this.busqueda=true;
            },
            (error) =>{
              console.log("No se ha podido obetenr los datos");
            }
          );
          break;
        }
      }



      
      
    }
}
