import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataTables } from 'src/assets/core/utils/datatables.service';

declare var $: any; // Dichiara jQuery come variabile globale

@Component({
  selector: 'app-market-data-table',
  templateUrl: './market-data-table.component.html',
  styleUrls: ['./market-data-table.component.scss'],
  standalone: false,
})
export class MarketDataTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input('filterMarketData') filterMarketData: Array<any> = [];
  @Input('limit') limit: number = 0;
  @Input('tableSize') tableSize: number = 15;
  @Input('tableId') tableId: string = 'market_data_table';
  private dataTableInstance: any;

  constructor(private translate: TranslateService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
    if (
      (changes['filterMarketData'] &&
        !changes['filterMarketData'].firstChange) ||
      this.filterMarketData.length != 0
    ) {
      this.reinitializeDataTable();
      return;
    }
  }

  ngOnInit(): void {
    if (this.limit != 0)
      this.filterMarketData.splice(this.limit, this.filterMarketData.length);
  }

  private initializeDataTable(): void {
    // Inizializza la DataTable solo se non è già inizializzata
    if (!$.fn.DataTable.isDataTable('#' + this.tableId)) {
      setTimeout(() => {
        this.dataTableInstance = $('#' + this.tableId).DataTable({
          pageLength: this.tableSize, // Numero di righe di default
          lengthMenu: [10, 15, 25, 50, 100], // Opzioni della select
          paging: true,
          searching: true,
          ordering: true,
          info: true,
          order: [], // Non specifica nessun ordinamento iniziale
          columnDefs: [
            {
              targets: [3, 4, 5, 6],
              visible: true,
              className: 'hidden_mobile',
            }, // Nasconde queste colonne sui dispositivi mobili
          ],
          language: {
            search: '',
            lengthMenu: this.translate.instant(
              'core_header_footer.datatables_pagination'
            ),
            info: this.translate.instant(
              'core_header_footer.datatables_result'
            ),
          },
        });
        DataTables.setDatatablesStyle(
          this.tableId,
          this.translate.instant('market_data_page.search')
        );
        //this.setStyleForInputSearch();
      }, 0);
    }
  }

  private reinitializeDataTable(): void {
    // Distruggi la DataTable se esiste già
    if (this.dataTableInstance) {
      this.dataTableInstance.clear(); // Pulire i dati
      this.dataTableInstance.destroy(); // Distruggere l'istanza
      this.dataTableInstance = null;
    }

    // Reinizializza la DataTable con i nuovi dati
    this.initializeDataTable();
  }

  ngOnDestroy(): void {
    if (this.dataTableInstance) {
      this.dataTableInstance.clear(); // Pulire i dati
      this.dataTableInstance.destroy(); // Distruggere l'istanza
      this.dataTableInstance = null;
    }
  }
}
