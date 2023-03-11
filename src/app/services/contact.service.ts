import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private AppUrl = 'https://localhost:7269/';

  constructor(private http: HttpClient) { }

  getListContacts(): Observable<any>{
    return this.http.get(this.AppUrl + 'Table');
  }

  updateContact(contact: any): Observable<any> {
    return this.http.put(this.AppUrl + 'update/?id=' + contact.Id, contact );
  }

  newContact(contact: any): Observable<any> {
    return this.http.post(this.AppUrl + 'New_Contact', contact);
  }

  deleteContact(id: any): Observable<any> {
    return this.http.delete(this.AppUrl + 'delete?id=' + id);
  }

  searchById(id:any): Observable<any>{
    return this.http.get(this.AppUrl + 'SearchById?id=' + id);
  }

  searchByNombre(nombre:any): Observable<any>{
    return this.http.get(this.AppUrl + 'SearchByNombre?nombre=' + nombre);
  }

  searchByDireccion(direccion:any): Observable<any>{
    return this.http.get(this.AppUrl + 'SearchByDireccion?direccion=' + direccion);
  }

  searchByTelefono(telefono:any): Observable<any>{
    return this.http.get(this.AppUrl + 'SearchByTelefono?telefono=' + telefono);
  }

  searchByCURP(curp:any): Observable<any>{
    return this.http.get(this.AppUrl + 'SearchByCurp?curp=' + curp);
  }

  searchByFechaRegistro(fecha:any): Observable<any>{
    return this.http.get(this.AppUrl + 'SearchByFechaRegistro?fecha=' + fecha);
  }
}
