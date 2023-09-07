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
import { SharedTableData } from '../../../../../../libs/shared/src/lib/models/shared-table-data.model';
import { User } from 'libs/shared/src/lib/models/user.model';

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
  headers = ['User', 'Total points'];
  currentPage$ = new BehaviorSubject<number>(0);
  public chartOptions: Partial<ChartOptions>;

  constructor(
    public dialogRef: MatDialogRef<StatisticsPopupComponent>,
    @Inject(MAT_DIALOG_DATA)
    public chartData: ChartData
  ) {
    this.chartOptions = {
      series: [
        {
          name: 'Answers',
          data: this.chartData.answersCount.map((a: { count: any }) => a.count),
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
            formatter: function (seriesName: any) {
              return '';
            },
          },
          formatter: function (
            value: any,
            { series, seriesIndex, dataPointIndex, w }: any
          ) {
            const userAnswer = chartData.answersCount[dataPointIndex];
            const users = userAnswer.users
              .map((user: User) => `${user.name} ${user.surname}`)
              .join('<br>');
            return `${users}`;
          },
        },
      },
      xaxis: {
        categories: this.chartData.allOptions.map(
          (opt: { option: any }) => opt.option
        ),
        position: 'bottom',
        labels: {
          style: {
            colors: this.chartData.allOptions.map(opt =>
              opt.isCorrect ? '#538d22' : '#ff0000'
            ),
            fontWeight: 600,
            fontSize: '13px',
          },
        },
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

  closePopup(): void {
    this.dialogRef.close();
  }
}
