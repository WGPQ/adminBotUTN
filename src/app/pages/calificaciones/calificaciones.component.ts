import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChatState } from 'src/app/store/Chat/chat.state';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-calificaciones',
  templateUrl: './calificaciones.component.html',
  styleUrls: ['./calificaciones.component.css'],
})
export class CalificacionesComponent implements OnInit {
  cargando: boolean = true;
  scores: any[] = [];
  currentDate: Date = new Date();
  calificaciones: any[] = [
    {
      label: 'Excelente',
      cantidad: 0,
      emogi: `🙂`,
    },
    {
      label: 'Regular',
      cantidad: 0,
      emogi: `😐`,
    },
    {
      label: 'Malo',
      cantidad: 0,
      emogi: `🙁`,
    },
    {
      label: 'No calificados',
      cantidad: 0,
      emogi: `😶`,
    },
  ];

  @ViewChild(BaseChartDirective) chartDona: BaseChartDirective | undefined;

  constructor(private store: Store) {
    this.cargando = true;
    this.store.select(ChatState.getSessiones).subscribe((calificaciones) => {
      this.pieChartData.datasets = [{ data: calificaciones }];
      this.chartDona?.update();
      this.calificaciones = [
        ...this.calificaciones.map((cal, index) => {
          return { ...cal, cantidad: calificaciones[index] ?? 0 };
        }),
      ];
      this.cargando = false;
    });
  }

  ngOnInit(): void {}

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Excelente', 'Regular', 'Malo', 'No calificados'],
    datasets: [
      {
        data: [0, 0, 0, 0],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';

  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    // responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        // padding: 30,
        color: '#DB0D74',
        position: 'left',
      },
      subtitle: {
        // padding: 30,
      },

      // datalabels: {},
    },
  };
  exportar() {
    const fileName = 'calificaciones.xlsx';
    /* pass here the table id */
    let element = document.getElementById('calificaciones-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }
}
