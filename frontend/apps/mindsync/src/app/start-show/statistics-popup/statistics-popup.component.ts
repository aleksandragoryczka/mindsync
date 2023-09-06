import { Component, Inject, Input, ViewChild } from '@angular/core';
import {
  ChartData,
  UserAnswer,
} from '../../../../../../libs/shared/src/lib/models/chart-data.model';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'project-statistics-popup',
  templateUrl: './statistics-popup.component.html',
  styleUrls: ['./statistics-popup.component.scss'],
})
export class StatisticsPopupComponent {
  @ViewChild('chart') chart!: ChartComponent;
  alphabet: string[] = ['a.', 'b.', 'c.', 'd.', 'e.', 'f.'];
  caption = 'Users answers';
  totalShowsNumberOfPages = 1;
  rowsPerPage = 10;
  headers = ['User', 'Correct answers', 'Wrong answers', 'Total points'];
  currentPage$ = new BehaviorSubject<number>(0);
  public chartOptions: Partial<ChartOptions>;

  constructor(
    public dialogRef: MatDialogRef<StatisticsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public chartData: ChartData
  ) {
    this.chartOptions = {
      series: [
        {
          name: 'Answers',
          data: this.chartData.answersCount.map(a => a.count),
        },
      ],
      chart: { height: 340, type: 'bar' },
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'bottom',
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '13px',
          colors: ['#46260b'],
        },
      },
      tooltip: {
        y: {
          title: {
            formatter: function (seriesName) {
              return '';
            },
          },
          formatter: function (
            value: any,
            { series, seriesIndex, dataPointIndex, w }: any
          ) {
            const userAnswer = chartData.answersCount[dataPointIndex];
            const users = userAnswer.users
              .map(user => `${user.name} ${user.surname}`)
              .join('<br>');
            return `${users}`;
          },
        },
      },
      xaxis: {
        categories: this.chartData.allOptions.map(opt => opt.option),
        position: 'bottom',

        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { show: false },
      },
      fill: {
        colors: [
          function ({
            value,
            seriesIndex,
            dataPointIndex,
            w,
          }: {
            value: any;
            seriesIndex: any;
            dataPointIndex: any;
            w: any;
          }) {
            if (chartData.allOptions[dataPointIndex].isCorrect)
              return '#538d22';
            return '#ff0000';
          },
        ],
      },
      title: {
        text: this.chartData.slideTitle,
        align: 'center',
        style: {
          color: '#46260b',
        },
      },
    };
  }

  setPage(pageNumber: number): void {
    this.currentPage$.next(pageNumber);
  }
}
