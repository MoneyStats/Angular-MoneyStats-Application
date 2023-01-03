import { Component, Input, OnInit } from '@angular/core';
import { Dashboard } from 'src/assets/core/data/class/dashboard.class';
import { ChartOptions } from 'src/assets/core/data/constant/apex.chart';
import { ChartService } from 'src/assets/core/utils/chart.service';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
})
export class DataComponent implements OnInit {
  public chartOptions?: Partial<ChartOptions>;
  @Input('dashboard') dashboard: Dashboard = new Dashboard();

  constructor(private charts: ChartService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.chartOptions = this.charts.renderChartLine(this.dashboard);
    }, 100);
  }

  currentYear(): string {
    return new Date().getFullYear().toString();
  }
}
