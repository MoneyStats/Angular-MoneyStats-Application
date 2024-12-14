import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CryptoDashboard } from 'src/assets/core/data/class/crypto.class';
import { Stats } from 'src/assets/core/data/class/dashboard.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { DataTables } from 'src/assets/core/utils/datatables.service';
import { ScreenService } from 'src/assets/core/utils/screen.service';

declare var $: any; // Dichiara jQuery come variabile globale

@Component({
  selector: 'app-resume-assets',
  templateUrl: './resume-assets.component.html',
  styleUrls: ['./resume-assets.component.scss'],
  standalone: false,
})
export class ResumeAssetsComponent implements OnChanges {
  amount: string = '******';
  @Input('hidden') hidden: boolean = false;
  public chartOptions?: Partial<ApexOptions>;
  @Input('resumeData') resumeData: CryptoDashboard = new CryptoDashboard();
  //resume: Map<string, CryptoDashboard> = new Map<string, CryptoDashboard>();
  @Input('isPast') isPast: boolean = false;
  balances: Array<number> = [];
  filterDateHistory: string[] = [];

  resumeDataFilterOnDate: CryptoDashboard = new CryptoDashboard();

  tableBalance: Array<any> = [];
  private tableId = 'crypto_resume_table';
  private dataTableInstance: any;

  constructor(private translate: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getDatas();
    if (changes['resumeData']) {
      this.reinitializeDataTable();
    }
  }

  private reinitializeDataTable(): void {
    // Distruggi la DataTable se esiste già
    if (this.dataTableInstance) {
      this.dataTableInstance.destroy();
      $('#' + this.tableId).empty();
      this.dataTableInstance = null;

      const table = document.getElementById(this.tableId);
      const datePipe = new DatePipe('en-US'); // Crea un'istanza di DatePipe per formattare la data

      // Crea l'head della tabella dinamicamente
      const head = this.resumeData.assets
        .map((a) => {
          return `<th scope="col" class="text-center">
                  <img src="${a.icon}" style="border-radius: 50%; width: 25px; height: 25px; align-items: center; justify-content: center; margin-right: 5px; margin-left: -10px;" alt="" />
                  ${a.name}
                </th>`;
        })
        .join(''); // Unisci tutte le celle <th> in una stringa

      // Crea il corpo della tabella dinamicamente
      const body = this.tableBalance
        .slice()
        .reverse()
        .map((balances, index) => {
          const balanceCells = balances
            .map((balance: any, y: number) => {
              const balanceClass =
                balances.index !== y
                  ? balance.percentage === 0
                    ? 'text-warning'
                    : balance.percentage > 0
                    ? 'text-success'
                    : 'text-danger'
                  : '';
              const balanceTextClass =
                balances.index === y
                  ? balance.balance === 0
                    ? 'text-warning'
                    : balance.balance > 0
                    ? 'text-success'
                    : 'text-danger'
                  : '';

              // Gestione della classe per l'ultimo elemento
              const isLastElement = y === balances.length - 1;
              const lastElementClass = isLastElement ? balanceTextClass : ''; // Aggiungi classe speciale per l'ultimo elemento

              // Aggiungi il trend solo se balances.index non è uguale a y
              const trendHtml =
                balances.index !== y
                  ? `<span>(${
                      balance.percentage >= 1000 ? '+1000' : balance.percentage
                    }%)</span>`
                  : '';

              return `<td style="line-height: 23px;" class="${balanceClass} ${lastElementClass} ${
                balances.index - 1 === y || balances.index === y
                  ? 'text-end'
                  : 'text-center'
              }">
                  ${this.resumeData.currency} ${
                this.hidden ? this.amount : balance.balance
              }
                  ${trendHtml} <!-- Aggiungi il trend dinamicamente -->
                </td>`;
            })
            .join(''); // Unisci tutte le celle <td> in una stringa

          // Formattazione della data con la pipe Date
          const formattedDate = datePipe.transform(
            balances[balances.length - 2].date,
            'dd MMM yyyy'
          );

          return `<tr>
                  <th style="line-height: 23px; width: 100px" scope="row">${formattedDate}</th>
                  ${balanceCells}
                </tr>`;
        })
        .join(''); // Unisci tutte le righe <tr> in una stringa

      // Crea l'HTML completo per la tabella
      const data = `<thead>
                      <tr>
                        <th scope="col">${this.translate.instant(
                          'resume_page.table_date'
                        )}</th>
                        ${head}
                        <th scope="col" class="text-end">${this.translate.instant(
                          'shared_text.amount'
                        )}</th>
                        <th scope="col" class="text-end">${this.translate.instant(
                          'resume_page.table_trend'
                        )}</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${body}
                    </tbody>`;

      // Aggiungi l'HTML della tabella all'elemento
      if (table) table.innerHTML = data;
    }

    // Reinizializza la DataTable con i nuovi dati
    this.initializeDataTable();
  }

  private initializeDataTable(): void {
    // Inizializza la DataTable solo se non è già inizializzata
    if (!$.fn.DataTable.isDataTable('#' + this.tableId)) {
      setTimeout(() => {
        this.dataTableInstance = $('#' + this.tableId).DataTable({
          pageLength: 12, // Numero di righe di default
          paging: true,
          responsive: true,
          searching: false,
          ordering: false,
          info: true,
          order: [], // Non specifica nessun ordinamento iniziale
          language: {
            search: '',
            lengthMenu: this.translate.instant('crypto_resume_page.tableAsset'),
            info: this.translate.instant(
              'core_header_footer.datatables_result'
            ),
            emptyTable: this.translate.instant('crypto_resume_page.warning'),
          },
          //dom: 'rtip', // Mostra solo: table (r), pagination (t), info (i), paging (p)
        });
        DataTables.setDatatablesStyle(
          this.tableId,
          this.translate.instant('market_data_page.search')
        );
      }, 100);
    }
  }

  getDatas() {
    this.resumeData.holdingLong.trend =
      this.resumeData.holdingLong.balance /
      (1 + this.resumeData.holdingLong.performance / 100);
    setTimeout(() => {
      if (this.resumeData.assets) {
        this.resumeDataFilterOnDate = Utils.copyObject(this.resumeData);
        if (!this.isPast)
          this.resumeDataFilterOnDate.assets =
            this.resumeDataFilterOnDate.assets.filter((a) => a.balance != 0);
        if (ScreenService.isMobileDevice()) {
          this.chartOptions = ChartService.renderCryptoDatas(
            this.resumeData,
            ScreenService.isMobileDevice(),
            [200, this.isPast]
          );
        } else
          this.chartOptions = ChartService.renderCryptoDatas(
            this.resumeData,
            ScreenService.isMobileDevice(),
            [350, this.isPast]
          );
      }
    }, 100);
    this.renderTable();
  }

  renderTable() {
    this.tableBalance = [];
    this.balances = [];
    if (this.resumeData.statsAssetsDays) {
      //let moreThanOneInAMonth: Array<string> = [];
      this.resumeData.statsAssetsDays.forEach((date, index) => {
        let yearMonth: string = date.split('-')[0] + '-' + date.split('-')[1];

        //let find = moreThanOneInAMonth.find((d) => d.includes(yearMonth));
        //if (find && moreThanOneInAMonth.includes(find)) {
        //  moreThanOneInAMonth.pop();
        //  moreThanOneInAMonth.push(date);
        //} else {
        //  moreThanOneInAMonth.push(date);
        //}
        this.tableBalance.push(this.tableColumsCreateRefactor(date, index));
      });
      //moreThanOneInAMonth.forEach((date, index) => {
      //  this.tableBalance.push(this.tableColumsCreate(date, index));
      //});
      //this.dashboard.statsWalletDays = moreThanOneInAMonth;
    }
  }

  tableColumsCreateRefactor(date: string, index: number) {
    let array: any = [];

    this.resumeData.assets.forEach((a, index) => {
      let history = a.history?.find((h) => h.date.toString() === date);
      if (!history) {
        history = new Stats();
        history.balance = 0;
        history.date = new Date(date);
        history.percentage = 0;
        history.trend = 0;
      } else {
        if (index === this.resumeData.assets.length - 1) {
          this.filterDateHistory.push(history.date.toString());
        }
      }
      array.push(history);
    });
    let total: Stats = new Stats();
    total.balance = 0;
    total.date = new Date(date);
    array.forEach((h: any) => {
      if (h && h.balance != undefined && h.balance) {
        total.balance = parseFloat((total.balance + h.balance).toFixed(2));
      }
    });
    let percentage = (
      ((total.balance - this.balances[this.balances.length - 1]) /
        this.balances[this.balances.length - 1]) *
      100
    ).toFixed(2);
    total.percentage = parseFloat(percentage);

    if (Utils.isNullOrEmpty(total.percentage) || index == 0) {
      total.percentage = 0;
    }

    let trendStats: Stats = new Stats();
    let trend = (
      total.balance - this.balances[this.balances.length - 1]
    ).toFixed(2);
    trendStats.balance = parseFloat(trend);

    if (Utils.isNullOrEmpty(trendStats.balance)) {
      trendStats.balance = 0;
    }

    array.push(total);
    array.push(trendStats);
    this.balances.push(total.balance);
    array.index = array.length - 1;
    return array;
  }

  calculatePercentage(
    balance: number,
    oldBalance: number,
    isPast: boolean,
    pastPercentage: number
  ) {
    if (isPast) return pastPercentage;
    const res = (((balance - oldBalance) / oldBalance) * 100).toFixed(2);
    return Number.parseFloat(res);
  }
}
