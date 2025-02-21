import { DatePipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Dashboard, Stats } from 'src/assets/core/data/class/dashboard.class';
import { ApexOptions } from 'src/assets/core/data/constant/apex.chart';
import { Utils } from 'src/assets/core/services/config/utils.service';
import { ChartService } from 'src/assets/core/utils/chart.service';
import { DataTables } from 'src/assets/core/utils/datatables.service';

declare var $: any; // Dichiara jQuery come variabile globale

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  standalone: false,
})
export class DataComponent implements OnChanges, OnDestroy {
  public chartOptions?: Partial<ApexOptions>;
  public chartPie?: Partial<ApexOptions>;
  public chartBar?: Partial<ApexOptions>;
  @Input('dashboard') dashboard: Dashboard = new Dashboard();
  @Input('coinSymbol') coinSymbol: string = '';
  balances: Array<number> = [];
  tableBalance: Array<any> = [];
  filterDateHistory: string[] = [];

  amount: string = '******';
  @Input('hidden') hidden: boolean = false;
  @Input('change') change: string = '';

  effectiveDates: string[] = [];

  private tableId = 'resume_table';
  private dataTableInstance: any;

  constructor(private translate: TranslateService) {}

  ngOnDestroy(): void {
    if (this.dataTableInstance) {
      this.dataTableInstance.clear(); // Pulire i dati
      this.dataTableInstance.destroy(); // Distruggere l'istanza
      this.dataTableInstance = null;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dashboard']) {
      this.renderTable();
      this.reinitializeDataTable();
    } else if (changes['change']) this.renderChart();
  }

  private initializeDataTable(): void {
    // Inizializza la DataTable solo se non è già inizializzata
    if (!$.fn.DataTable.isDataTable('#' + this.tableId)) {
      setTimeout(() => {
        this.dataTableInstance = $('#' + this.tableId).DataTable({
          pageLength: 12, // Numero di righe di default
          responsive: true,
          paging: true,
          layout: {
            bottom: {
              buttons: [
                'csv',
                'excel',
                {
                  extend: 'pdfHtml5',
                  text: 'PDF',
                  //orientation: 'landscape',
                  customize: function (doc: any) {
                    DataTables.customizeExportPDF(doc);
                  },
                },
              ],
              //buttons: ["csv", "excel", "pdf", "print"],
            },
          },
          searching: false,
          ordering: false,
          info: true,
          order: [], // Non specifica nessun ordinamento iniziale
          language: {
            search: '',
            lengthMenu: this.translate.instant('resume_page.table'),
            info: this.translate.instant(
              'core_header_footer.datatables_result'
            ),
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

  private reinitializeDataTable(): void {
    // Distruggi la DataTable se esiste già
    if (this.dataTableInstance) {
      this.dataTableInstance.destroy();
      $('#' + this.tableId).empty();
      this.dataTableInstance = null;

      const table = document.getElementById(this.tableId);
      const datePipe = new DatePipe('en-US'); // Crea un'istanza di DatePipe per formattare la data

      // Crea l'head della tabella dinamicamente
      const head = this.dashboard.wallets
        .map((w) => {
          return `<th scope="col" class="text-center">
                <img src="${w.img}" style="border-radius: 50%; width: 25px; height: 25px; align-items: center; justify-content: center; margin-right: 5px; margin-left: -10px;" alt="" />
                ${w.name}
              </th>`;
        })
        .join(''); // Unisci tutte le celle <th> in una stringa

      // Crea il corpo della tabella dinamicamente
      const body = this.tableBalance
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

              return `<td style="line-height: 23px; width: 100px" class="${balanceClass} ${lastElementClass} ${
                balances.index - 1 === y || balances.index === y
                  ? 'text-end'
                  : 'text-center'
              }">
                ${this.coinSymbol} ${
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
                <th style="line-height: 23px;" scope="row">${formattedDate}</th>
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

  renderTable() {
    const dashboard: Dashboard = Utils.copyObject(this.dashboard);
    this.tableBalance = [];
    this.balances = [];
    if (dashboard.statsWalletDays) {
      //let moreThanOneInAMonth: Array<string> = [];
      //dashboard.statsWalletDays.forEach((date, index) => {
      //  let yearMonth: string = date.split('-')[0] + '-' + date.split('-')[1];
      //
      //  let find = moreThanOneInAMonth.find((d) => d.includes(yearMonth));
      //  if (find && moreThanOneInAMonth.includes(find)) {
      //    moreThanOneInAMonth.pop();
      //    moreThanOneInAMonth.push(date);
      //  } else {
      //    moreThanOneInAMonth.push(date);
      //  }
      //});
      let moreThanOneInAMonth: Array<string> = Utils.copyObject(
        dashboard.statsWalletDays
      );
      moreThanOneInAMonth.forEach((date, index) => {
        this.tableBalance.push(this.tableColumsCreateRefactor(date, index));
      });
      this.effectiveDates = moreThanOneInAMonth;
      this.tableBalance = this.tableBalance.reverse();
      //this.dashboard.statsWalletDays = moreThanOneInAMonth;
      this.renderChart();
    }
  }

  renderChart() {
    let dashboard = Utils.copyObject(this.dashboard);
    this.chartOptions = undefined;
    this.chartBar = undefined;
    this.chartPie = undefined;
    setTimeout(() => {
      Utils.mapLiveWalletsDataForChart(
        dashboard.statsWalletDays,
        dashboard.wallets
      );
      //this.chartOptions = ChartService.appRenderWalletPerformance(dashboard);
      ChartService.appRenderWalletPerformance(dashboard).then(
        (chart) => (this.chartOptions = chart)
      );
      this.chartPie = ChartService.appRenderChartPie(dashboard.wallets);
      const dates: string[] = Utils.copyObject(this.effectiveDates).map(
        (d: string) => {
          let dataLabels = new Date(d).toLocaleDateString();
          return Utils.formatDateIntl(dataLabels);
        }
      );
      this.chartBar = ChartService.appRenderChartBar(
        dates,
        this.coinSymbol,
        this.balances
      );
    }, 500);
  }

  currentYear(): string {
    return new Date().getFullYear().toString();
  }

  tableColumsCreateRefactor(date: string, index: number) {
    let array: any = [];
    const dashboard: Dashboard = Utils.copyObject(this.dashboard);

    dashboard.wallets.forEach((w, index) => {
      let history = w.history
        ? w.history.find((h) => h.date.toString() === date)
        : undefined;
      if (!history) {
        history = new Stats();
        history.balance = 0;
        history.date = new Date(date);
        history.percentage = 0;
        history.trend = 0;
      } else {
        if (index === dashboard.wallets.length - 1) {
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
        total.balance = Utils.roundToTwoDecimalPlaces(
          total.balance + h.balance
        );
      }
    });
    let percentage = Utils.roundToTwoDecimalPlaces(
      ((total.balance - this.balances[this.balances.length - 1]) /
        this.balances[this.balances.length - 1]) *
        100
    );
    total.percentage = percentage;

    if (Utils.isNullOrEmpty(total.percentage) || index == 0) {
      total.percentage = 0;
    }

    let trendStats: Stats = new Stats();
    let trend = Utils.roundToTwoDecimalPlaces(
      total.balance - this.balances[this.balances.length - 1]
    );
    trendStats.balance = trend;

    if (Utils.isNullOrEmpty(trendStats.balance)) {
      trendStats.balance = 0;
    }

    array.push(total);
    array.push(trendStats);
    this.balances.push(total.balance);
    array.index = array.length - 1;
    return array;
  }
}
