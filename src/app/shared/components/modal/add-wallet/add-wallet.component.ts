import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/assets/core/data/class/dashboard.class';
import { ModalConstant } from 'src/assets/core/data/constant/modal.constant';
import { DashboardService } from 'src/assets/core/services/dashboard.service';

@Component({
  selector: 'app-add-wallet',
  templateUrl: './add-wallet.component.html',
  styleUrls: ['./add-wallet.component.scss'],
})
export class AddWalletComponent implements OnInit {
  @Input('categoriesInput') categoriesInput?: Category[];
  categories?: Category[];
  constructor(private dashboardService: DashboardService) {}

  public get modalConstant(): typeof ModalConstant {
    return ModalConstant;
  }

  ngOnInit(): void {
    this.categories = this.dashboardService.dashboard.categories;
    console.log(this.categories);
    console.log(this.categoriesInput);
  }
}
