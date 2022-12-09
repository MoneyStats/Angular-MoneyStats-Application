import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  annotations: ApexAnnotations;
  colors: string[];
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  labels: string[];
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  yaxis: ApexYAxis | ApexYAxis[];
  grid: ApexGrid;
  states: ApexStates;
  subtitle: ApexTitleSubtitle;
  theme: ApexTheme;
};
