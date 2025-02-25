import { Component, Input, OnInit } from '@angular/core';
import {
  categories,
  Category,
} from 'src/assets/core/data/class/dashboard.class';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  standalone: false,
})
export class CategoryModalComponent implements OnInit {
  @Input('modalId') modalId: string = '';
  categories: Array<Category> = categories;
  environment = environment;

  constructor() {}

  ngOnInit(): void {}

  setResult(category: Category) {
    let result: any = {};
    switch (category.name) {
      case 'Cash':
        result.img = 'cash-outline';
        result.color = 'bg-success';
        break;
      case 'Bank Account':
        result.img = 'wallet-outline';
        result.color = 'bg-warning';
        break;
      case 'Credit Card':
        result.img = 'card-outline';
        result.color = 'bg-danger';
        break;
      case 'Debit Card':
        result.img = 'card-outline';
        result.color = 'bg-dark';
        break;
      case 'Coupon':
        result.img = 'ticket-outline';
        result.color = 'bg-info';
        break;
      case 'Save':
        result.img = 'lock-closed-outline';
        result.color = 'bg-success';
        break;
      case 'Investments':
        result.img = 'bar-chart-outline';
        result.color = 'bg-primary';
        break;
      case 'Recurrence':
        result.img = 'alarm-outline';
        result.color = 'bg-danger';
        break;
      case 'Check':
        result.img = 'id-card-outline';
        result.color = 'bg-info';
        break;
      case 'Others':
        result.img = 'cube-outline';
        result.color = 'bg-secondary';
        break;
      default:
        result.img = 'fas fa-chart-bar';
        result.color = 'bg-dark';
        break;
    }
    return result;
  }
}
