import { Component } from '@angular/core';
import { Item } from 'src/app/model/item';
import { ListService } from 'src/app/services/list.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  newItem: Item;
  items$: Observable<Item[]>;
  

  constructor(private listService: ListService) {
    this.items$ = this.listService.getItems$().pipe(tap(x => console.log(x)));
  }

  showAddItem() {
    this.newItem = new Item('');
  }

  addItem() {
    if(this.newItem.name) {
      this.listService.addItem(this.newItem);
    }
    this.newItem = null;
  }

  changeItem(item: Item) {
    item.isDone ? this.listService.unmarkItem(item) : this.listService.markItem(item);
  }

  cleanList() {
    this.listService.cleanList();
  }
}
