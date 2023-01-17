import { Component, OnInit, ViewChild } from '@angular/core';
import { Cliente } from 'src/app/interfaces/cliente.interface';
import { Listar } from 'src/app/interfaces/listar.interface';
import { Usuario } from 'src/app/interfaces/usuarios.interface';
import { ClienteService } from 'src/app/services/cliente.service';
import { UsuarioService } from 'src/app/services/usuario.service';
// import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
// import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit {
  usuariosOnline: Usuario[] = [];
  clientes: Cliente[] = [];
  // @ViewChild(BaseChartDirective) chart: BaseChartDirective | u÷ndefined;

  // public barChartOptions: ChartConfiguration['options'] = {
  //   elements: {
  //     line: {
  //       tension: 0.4,
  //     },
  //   },
  //   scales: {
  //     x: {},
  //     y: {
  //       min: 10,
  //     },
  //   },
  //   plugins: {
  //     legend: { display: true },
  //   },
  // };
  // public barChartLabels: string[] = [
  //   '2006',
  //   '2007',
  //   '2008',
  //   '2009',
  //   '2010',
  //   '2011',
  //   '2012',
  // ];
  // public barChartType: ChartType = 'bar';

  // public barChartData: ChartData<'bar'> = {
  //   labels: this.barChartLabels,
  //   datasets: [
  //     { data: [65, 59, 80, 81, 56, 55, 40], label: 'Bot' },
  //     { data: [28, 48, 40, 19, 86, 27, 90], label: 'Operador' },
  //   ],
  // };

  // events
  // public chartClicked({
  //   event,
  //   active,
  // }: {
  //   event?: ChartEvent;
  //   active?: {}[];
  // }): void {
  //   console.log(event, active);
  // }

  // public chartHovered({
  //   event,
  //   active,
  // }: {
  //   event?: ChartEvent;
  //   active?: {}[];
  // }): void {
  //   console.log(event, active);
  // }

  constructor(
    private usuarioService: UsuarioService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.getConectados(2);
    this.getClientes();
  }

  getConectados(rol: number) {
    this.usuarioService.usuarioEnLinea(rol).subscribe((resp) => {
      this.usuariosOnline = resp;
    });
  }
  getClientes() {
    var listar: Listar = {
      columna: '',
      search: '',
      offset: 0,
      limit: '0',
      sort: '',
    };
    // this.clienteService.obtenerClientes(listar).subscribe((resp) => {
    //   this.clientes = resp;
    // });
  }
}
