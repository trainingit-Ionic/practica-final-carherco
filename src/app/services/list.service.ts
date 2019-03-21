import { Injectable } from '@angular/core';
import { Item } from 'src/app/model/item';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  private items: Item[] = [];
  private items$: BehaviorSubject<Item[]> = new BehaviorSubject(this.items);
  private history: string[] = [];
  private history$: BehaviorSubject<string[]> = new BehaviorSubject(this.history);

  constructor(private storage: Storage, private platform: Platform) { 
    this.recoverList();
    this.recoverHistory();

    this.platform.pause.subscribe(
      () => this.persistList()
    );
    
    this.platform.resume.subscribe(
      () => this.recoverList()
    );
  }

  private notify(): void {
    this.items$.next([...this.items]);
  }

  public getItems$(): Observable<Item[]> {
    return this.items$.asObservable();
  }

  addItem(item: Item): void {
    this.items.push(item);
    this.notify();
    this.addToHistory(item.name);
  }

  deleteItem(item: Item): void {
    this.items = this.items.filter( el => el.name != item.name);
    this.notify();
  }

  markItem(item: Item): void {
    this.items.map( (el) => {
      if(el.name == item.name) {
        el.isDone = true;
      }
      return el;
    });
    this.notify();
  }

  unmarkItem(item: Item): void {
    this.items.map( (el) => {
      if(el.name == item.name) {
        el.isDone = false;
      }
      return el;
    });
    this.notify();
  }

  cleanList() {
    this.items = [];
    this.notify();
  }

  persistList() {
    this.storage.set('shoppingList',this.items);
  }

  recoverList() {
    this.storage.get('shoppingList').then(
      items => {
        if(items) {
          this.items = items;
          this.notify();
        }
      }
    );
  }

  private addToHistory(name: string) {
    this.history.push(name);
    this.history$.next(this.history);
    this.persistHistory();
  }

  getHistory$(): Observable<string[]> {
    return this.history$.asObservable();
  }

  persistHistory() {
    this.storage.set('history',this.history);
  }

  recoverHistory() {
    this.storage.get('history').then(
      names => {
        if(names) {
          this.history = names;
          this.history$.next(this.history);
        }
      }
    );
  }
}
