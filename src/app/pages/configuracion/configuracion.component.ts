import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Disponibilidad } from 'src/app/interfaces/disponibilidad.interface';
import { Listar } from 'src/app/interfaces/listar.interface';
import { AlertService } from 'src/app/services/alert.service';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { FormsService } from 'src/app/services/forms.service';
import { SetConfiguracion } from 'src/app/store/Configuracion/configuracion.actions';
import { ConfiguracionState } from 'src/app/store/Configuracion/configuracion.state';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: [],
})
export class ConfiguracionComponent implements OnInit, OnDestroy {
  disponibilidad: Disponibilidad[] = [];
  cargando = false;
  disponibilidadForm!: FormGroup;
  dispId!: string;
  submitType: string = 'Guardar';
  action = 'Agregar';
  setTimeRef: any;
  @ViewChild('closebutton') closebutton: any;
  horarios: any[] = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
    '23:59',
  ];

  constructor(
    private store: Store,
    private configServices: ConfiguracionService,
    private formService: FormsService,
    private alertService: AlertService
  ) {
    this.cargando = true;
    this.disponibilidadForm = formService.crearFormularioDisponibilidad();
    // this.disponibilidadForm.controls['dia'].disable();
  }

  ngOnInit(): void {
    this.fetchConfiguracion();
  }

  ngOnDestroy(): void {
    clearTimeout(this.setTimeRef);
  }
  get diaNoValido() {
    return (
      this.disponibilidadForm.get('dia')?.invalid &&
      this.disponibilidadForm.get('dia')?.touched
    );
  }
  get horaIniNoValida() {
    return (
      this.disponibilidadForm.get('hora_inicio')?.invalid &&
      this.disponibilidadForm.get('hora_inicio')?.touched
    );
  }

  getDiasDisponibles() {
    var listar: Listar = {
      columna: '',
      search: '',
      offset: 0,
      limit: '10',
      sort: '',
    };
    this.configServices
      .obtenerDisponibilidades(listar)
      .subscribe((response) => {
        this.disponibilidad = response;
        this.cargando = false;
      });
  }

  fetchConfiguracion() {
    this.store
      .select(ConfiguracionState.getDisponibilidadList)
      .subscribe((disponibilidadList: Disponibilidad[]) => {
        this.disponibilidad = disponibilidadList;
        this.setTimeRef = setTimeout(() => (this.cargando = false), 500);
      });
  }

  editar(config: Disponibilidad) {
    this.action = 'Editar';
    this.submitType = 'Actualizar';
    this.dispId = config?.id!;
    this.disponibilidadForm.patchValue({
      dia: config.dia,
      hora_inicio: config.hora_inicio,
      hora_fin: config.hora_fin,
      activo: config.activo,
    });
  }

  guardarDisponibilidad() {
    if (this.disponibilidadForm.invalid) {
      return Object.values(this.disponibilidadForm.controls).forEach(
        (contr) => {
          if (contr instanceof FormGroup) {
            Object.values(contr.controls).forEach((contr) =>
              contr.markAllAsTouched()
            );
          } else {
            contr.markAsTouched();
          }
        }
      );
    }
    const data: Disponibilidad = {
      id: this.dispId,
      dia: this.disponibilidadForm.value.dia,
      hora_inicio: this.disponibilidadForm.value.hora_inicio,
      hora_fin: this.disponibilidadForm.value.hora_fin,
      activo: this.disponibilidadForm.value.activo,
    };

    this.configServices.actualizarDisponibilidad(data).subscribe((resp) => {
      if (resp.exito) {
        this.alertService.correcto(resp.data.nombre, resp.message).then(() => {
          this.closebutton.nativeElement.click();
          this.store.dispatch(new SetConfiguracion(resp?.data));
        });
      } else {
        this.alertService.error('Error', resp.message);
      }
    });
  }
}
