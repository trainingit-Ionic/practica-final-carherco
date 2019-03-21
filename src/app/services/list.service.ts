import { Injectable } from '@angular/core';
import { Item } from 'src/app/model/item';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  private items: Item[] = [];
  private items$: BehaviorSubject<Item[]> = new BehaviorSubject(this.items);

  constructor() { }

  private notify(): void {
    this.items$.next({...this.items});
  }

  public getItems$(): Observable<Item[]> {
    return this.items$.asObservable();
  }

  addItem(item: Item): void {
    this.items.push(item);
    this.notify();
  }

  deleteItem(item: Item): void {
    this.items = this.items.filter( el => el.name != item.name);
    this.notify();
  }

  markItem(item: Item): void {
    this.items.map( (el) => {
      if(el.name == item.name) {
        el.pending = false;
      }
      return el;
    });
    this.notify();
  }

  unmarkItem(item: Item): void {
    this.items.map( (el) => {
      if(el.name == item.name) {
        el.pending = true;
      }
      return el;
    });
    this.notify();
  }

  persistList() {
    this.notify();
  }

  recoverList() {
    this.notify();
  }

  cleanList() {
    this.items = [];
    this.notify();
  }
}
