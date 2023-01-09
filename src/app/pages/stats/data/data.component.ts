import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { ChartOptions } from 'src/assets/core/data/constant/apex.chart';
import { ChartService } from 'src/assets/core/utils/chart.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit, OnChanges {
  public chartOptions?: Partial<ChartOptions>;
  public chartPie?: Partial<ChartOptions>;
  public chartBar?: Partial<ChartOptions>;
  @Input('dashboard') dashboard: Dashboard = new Dashboard();

  constructor(private charts: ChartService) {}
  
  ngOnChanges(changes: SimpleChanges): void {
    this.renderChart();
  }

  ngOnInit(): void {
    this.renderChart();
  }

  renderChart() {
    setTimeout(() => {
      this.chartOptions = this.charts.renderChartLine(this.dashboard);
      this.chartPie = this.charts.renderChartPie(this.dashboard.wallets);
      this.chartBar = this.charts.renderChartBar(this.dashboard.wallets);
    }, 100);
  }

  currentYear(): string {
    return new Date().getFullYear().toString();
  }
}
