import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transaction-card',
  templateUrl: './transaction-card.component.html',
  styleUrls: ['./transaction-card.component.scss'],
})
export class TransactionCardComponent implements OnInit {
  @Input('walletImg') walletImg?: string;
  @Input('walletName') walletName?: string;
  @Input('category') category?: string;
  @Input('differenceLastStats') differenceLastStats?: string;
  @Input('class') class?: string;

  constructor() {}

  ngOnInit(): void {}
}
