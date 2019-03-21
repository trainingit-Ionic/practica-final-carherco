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
  autocompleteOptions: string[];
  autocompleteFilteredOptions: string[] = [];
  
  constructor(private listService: ListService) {
    this.items$ = this.listService.getItems$();
    this.listService.getHistory$().subscribe(
      history => this.autocompleteOptions = history
    );
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

  autocompleteSearch() {
    if (!this.newItem.name.trim().length) {
      this.autocompleteFilteredOptions = [];
      return;
    }
    
    this.autocompleteFilteredOptions = this.autocompleteOptions.filter( name => name.toLowerCase().includes(this.newItem.name.toLowerCase()));
    console.log(this.autocompleteFilteredOptions);
  }

  selectOption(option: string) {
    this.newItem.name = option;
  }

  
}
