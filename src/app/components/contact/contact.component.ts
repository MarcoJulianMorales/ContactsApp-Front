import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from 'src/app/services/contact.service';
import { read, utils } from 'xlsx';
import  Swal  from 'sweetalert2';

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
  pages: any [] = [];
  page: any = '1';
  guardar = '';
  
  constructor(
    private fb: FormBuilder,
    private _contactService: ContactService
    ){
      this.forma = this.fb.group({
        Id: [''],
        FechaRegistro: ['',],
        Nombre: ['', Validators.required,],
        Direccion: ['', Validators.required],
        Telefono: ['', [Validators.required, Validators.pattern("[0-9]+"), Validators.minLength(7), Validators.maxLength(15)]],
        CURP: ['', [Validators.required, Validators.maxLength(18), Validators.minLength(18), Validators.pattern("[A-Z 0-9]+")]],
        campoBusqueda: ['', ]
      });
    }

    ngOnInit(): void {
      let timerInterval: any = '';
      Swal.fire({
        title: 'Bienvenido!',
        html: 'Cargando datos',
        timer: 700,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
          
        },
        willClose: () => {
          clearInterval(timerInterval)
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          // console.log('I was closed by the timer')
        }
      });
      this.getContacts();
    }

    //FrontEnd Interactive Methods
    resetModel(){
      this.guardar='Add';
      this.forma.get("FechaRegistro")?.setValue("");
      this.forma.get("Id")?.setValue("");
      this.forma.get("Nombre")?.setValue("");
      this.forma.get("Direccion")?.setValue("");
      this.forma.get("CURP")?.setValue("");
      this.forma.get("Telefono")?.setValue(null);
      this.forma.get("campoBusqueda")?.setValue("");
    }

    changeCriteria(criteria:any){
      this.criterioBusqueda= '' + criteria;
      // console.log(this.criterioBusqueda);
      this.resetModel();
    }

    separatePages(lista :any){
      this.pages = [];
      this.listaContacts = [];
      let page: number =0;
      let tmpList : any [] = [];
  
      for(let i =1; i<=lista.length; i++){//recorre la lista del praram con todos los registros
        tmpList.push(lista[i-1]);
        if(i%10 ==0)
        {
          this.listaContacts.push(tmpList);//cuando llega a 10 mete la lista tmp dentro de la lista principal
          tmpList=[];
        }
        if(i==lista.length && i%10!=0){
          this.listaContacts.push(tmpList);//cuando llega al final de la lista del param mete lo que resta a la lista principal
          tmpList=[];
        }
        if(i%10 == 1){
          page++;//cuando llega a 1, 11, 21.. considera que habrá una nueva página
          this.pages.push(page);
        }
      }
      // console.log('num de paginas: ', this.pages);
      // console.log('listas', this.listaContacts, 'tamaño: ', this.listaContacts.length);
    }

    changePage(page: any){
      this.page=page;
    }
  
    previousPage(){
      this.page--;
    }
  
    nextPage(){
      this.page++;
    }

    //Importar CSV
    importCSV(importData:any){
      this._contactService.importCSV(importData).subscribe(
        (data) =>{
          // console.log("Se importo el archivo correctamente.");
          Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: 'Archivo importado exitosamente!'
          })
          this.getContacts();
        },
        (error) =>{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se ha podido importar el archivo!'
          })
          // console.log("no se ha podido importar el archivo");
        }
      )
    }

    onFileChange(event:any){
      const files = event.target.files;
      if(files.length){
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event:any)=>{
          const wb = read(event.target.result);

          const sheets = wb.SheetNames;

          if(sheets.length){
            const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
            let importData: any [] = [];
            importData=rows;
            if(importData){
                // console.log(importData)
              importData.forEach(dat => {
                // console.log("data a importar: ",dat)
                  this.forma.get("Nombre")?.setValue(dat.Nombre);
                  this.forma.get("Direccion")?.setValue(dat.Direccion);
                  this.forma.get("CURP")?.setValue(dat.CURP);
                  this.forma.get("Telefono")?.setValue(''+dat.Telefono);
                  this.addContact();
                }
              )
            }
          }
        }
        reader.readAsArrayBuffer(file);
      }
    }

    //Metodos CRUD
    getContacts(){
      this.busqueda=false;
      
      this.resetModel();
      
      this._contactService.getListContacts().subscribe(
        (data) => {
          // console.log(data);
          let lista = data;
          this.separatePages(lista);
        },
        (error) => {
          // console.log("No se ha podido obetenr los datos");
        }
      );
    }

    getContact(contact:any){
      this.guardar='Update';
      this.forma.get("Id")?.setValue(contact.id);
      this.forma.get("Nombre")?.setValue(contact.nombre);
      this.forma.get("Direccion")?.setValue(contact.direccion);
      this.forma.get("Telefono")?.setValue(contact.telefono);
      this.forma.get("CURP")?.setValue(contact.curp);
      this.forma.get("FechaRegistro")?.setValue(contact.fechaRegistro);
    }

    addContact(){
        const contact : any = {
        Nombre: this.forma.get("Nombre")?.value,
        Direccion: this.forma.get("Direccion")?.value,
        Telefono: this.forma.get("Telefono")?.value,
        CURP: this.forma.get("CURP")?.value
      };
      // console.log("Contact data:", contact);
  
      this._contactService.newContact(contact).subscribe(
        (data) => {
          Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: 'Agregado exitosamente!'
          })
          this.getContacts();
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo subir la información!'
          })
          // console.log(error);
          this.getContacts();
        });
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
          Swal.fire({
            icon: 'success',
            title: 'Ok',
            text: 'Contacto actualizado!'
          })
          this.getContacts();
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar la información!'
          })
          // console.log(error);
          this.getContacts();
        });
        this.resetModel();
    }

    deleteContact(){
      let id = this.forma.get("Id")?.value;
      this._contactService.deleteContact(id).subscribe(
        (data)=> {
          Swal.fire({
            icon: 'success',
            title: 'Done',
            text: 'Boorado exitosamente!'
          })
          // console.log("contacto eliminado correctamente");
          this.getContacts();
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo borrar el contacto!'
          })
          // console.log(error);
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
              // console.log(data);
              let lista = data;
              this.separatePages(lista);
              this.busqueda=true;
            },
            (error) =>{
              // console.log("No se ha podido obetenr los datos");
            }
          );
          break;
        }
        case 'Nombre' :{
          this._contactService.searchByNombre(campoBusqueda).subscribe(
            (data) => {
              // console.log(data);
              let lista = data;
              this.separatePages(lista);
              this.busqueda=true;
            },
            (error) =>{
              // console.log("No se ha podido obetenr los datos");
            }
          );
          break;
        }
        case 'Teléfono' :{
          this._contactService.searchByTelefono(campoBusqueda).subscribe(
            (data) => {
              // console.log(data);
              let lista = data;
              this.separatePages(lista);
              this.busqueda=true;
            },
            (error) =>{
              // console.log("No se ha podido obetenr los datos");
            }
          );
          break;
        }
        case 'Dirección' :{
          this._contactService.searchByDireccion(campoBusqueda).subscribe(
            (data) => {
              // console.log(data);
              let lista = data;
              this.separatePages(lista);
              this.busqueda=true;
            },
            (error) =>{
              // console.log("No se ha podido obetenr los datos");
            }
          );
          break;
        }
        case 'CURP' :{
          this._contactService.searchByCURP(campoBusqueda).subscribe(
            (data) => {
              // console.log(data);
              let lista = data;
              this.separatePages(lista);
              this.busqueda=true;
            },
            (error) =>{
              // console.log("No se ha podido obetenr los datos");
            }
          );
          break;
        }
        case 'Fecha de Registro' :{
          // console.log(this.forma.get("campoBusqueda")?.value)
          this._contactService.searchByFechaRegistro(campoBusqueda).subscribe(
            (data) => {
              // console.log(data);
              let lista = data;
              this.separatePages(lista);
              this.busqueda=true;
            },
            (error) =>{
              // console.log("No se ha podido obetenr los datos");
            }
          );
          break;
        }
      }
    }

    //Validaciones
    CURPInValid() {
      return this.forma.get("CURP")?.invalid && this.forma.get("CURP")?.touched; 
    }

    TelefonoInValid() {
      return this.forma.get("Telefono")?.invalid && this.forma.get("Telefono")?.touched; 
    }

    NombreInValid() {
      return this.forma.get("Nombre")?.invalid && this.forma.get("Nombre")?.touched; 
    }
    
    DireccionInValid() {
      return this.forma.get("Direccion")?.invalid && this.forma.get("Direccion")?.touched; 
    }
}