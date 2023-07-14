import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { Store } from '@ngxs/store';
import { BaseChartDirective } from 'ng2-charts';
import { ChatState } from 'src/app/store/Chat/chat.state';
import * as XLSX from 'xlsx';
import { ChatService } from 'src/app/services/chat.service';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { SetInteracciones } from 'src/app/store/Chat/chat.actions';
import { Listar } from 'src/app/interfaces/listar.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { SetAccountState } from 'src/app/store/Account/account.state';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css'],
})
export class SolicitudesComponent implements OnInit {
  anios: any[] = [];
  meses: any[] = [];
  labelMeses: string[] = [];
  currentMes: number = new Date().getMonth() + 1;
  cargando: boolean = false;
  interacciones: any = {};
  interaccionesTable: any = [];
  bot?: Usuario;
  currentanio: any = new Date().getFullYear().toString();
  anio: any = new Date().getFullYear().toString();
  listar: Listar = {
    columna: '',
    search: '',
    offset: 0,
    limit: '0',
    sort: '',
  };
  solicitudes: any[] = [];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.4,
      },
    },
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: { display: true },
    },
  };
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: this.labelMeses,
    datasets: [
      { data: this.interacciones?.bot, label: 'Bot' },
      { data: this.interacciones?.agente, label: 'Agentes' },
    ],
  };

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    console.log(event, active);
  }

  constructor(private store: Store, private chatService: ChatService) {
    this.store.select(SetAccountState.getBot).subscribe((bot) => {
      this.bot = bot!;
    });
  }

  ngOnInit(): void {
    this.getInteracciones();
    this.getAnios();
    this.getMeses();
    this.prepareTable();
  }
  prepareTable() {
    this.interaccionesTable = this.meses.map((mes, index) => {
      return {
        mes: mes?.nombre,
        agente: this.interacciones?.agente[index],
        bot: this.interacciones?.bot[index],
        total:
          this.interacciones?.bot[index] + this.interacciones?.agente[index],
      };
    });
  }
  exportar() {
    const fileName = 'solicitudes.xlsx';
    /* pass here the table id */
    let element = document.getElementById('solicitudes-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }
  getInteracciones() {
    this.store
      .select(ChatState.getInteracciones)
      .subscribe((interacciones: any) => {
        this.interacciones = interacciones;
        this.barChartData.datasets = [
          { data: interacciones?.bot, label: 'Bot' },
          { data: interacciones?.agente, label: 'Agentes' },
        ];
        this.chart?.update();
        this.prepareTable();
      });
  }
  getAnios() {
    this.store.select(ChatState.getAnios).subscribe((a: any[]) => {
      this.anios = a;
    });
  }
  getMeses() {
    this.store.select(ChatState.getMeses).subscribe((m: any[]) => {
      this.meses = m;

      this.labelMeses = this.meses
        ?.filter((m) => m?.id <= this.currentMes)
        .map((mes) => mes?.shorName);
      this.barChartData.labels = this.labelMeses;
    });
  }
  checketLabel(mes: any) {
    return this.labelMeses?.some((m) => m === mes);
  }

  manejadorMes(mes: string) {
    var exist = this.labelMeses.some((m) => m === mes);
    if (exist) {
      this.labelMeses = this.labelMeses.filter((m) => m !== mes).sort();
    }
    if (!exist) {
      this.labelMeses = [...this.labelMeses, mes];
    }

    this.barChartData.labels = this.meses
      .filter((m) => this.labelMeses.includes(m?.shorName))
      .map((m) => m?.shorName);

    this.chart?.update();
  }
  manejadorAnio($event: any, anio: any) {
    this.anio = anio;
    this.cargando = true;
    this.chatService
      .getSolicitudes(anio, '', this.listar)
      .subscribe((solicitudes: Solicitud[]) => {
        this.store.dispatch(
          new SetInteracciones({
            list: solicitudes,
            bot: this.bot,
          })
        );
        this.cargando = false;
      });
  }
}
