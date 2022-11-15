import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivoValidador } from '../classes/validator/activo-validador';
import { ApellidoValidador } from '../classes/validator/apellido-validator';
import { ClaveValidador } from '../classes/validator/clave-validador';
import { ColumnaValidador } from '../classes/validator/columna-validator';
import { CorreoValidador } from '../classes/validator/correo-validador';
import { DescripcionValidador } from '../classes/validator/descripcion.validador';
import { DiaValidador } from '../classes/validator/dia-validator';
import { FraceValidador } from '../classes/validator/frace-validador';
import { HoraValidador } from '../classes/validator/hora-validator';
import { IntencionValidador } from '../classes/validator/intencion-validador';
import { LimitVlidador } from '../classes/validator/limit-validator';
import { NombreValidador } from '../classes/validator/nombre-validador';
import { OffsetVlidador } from '../classes/validator/offset-validator';
import { RecordarValidador } from '../classes/validator/recordar-validador';
import { RepeatClaveValidador } from '../classes/validator/repeat_clave';
import { RolValidador } from '../classes/validator/rol-validator';
import { SearchValidador } from '../classes/validator/search-validator';
import { SortValidador } from '../classes/validator/sort-validator';
import { TelefonoValidador } from '../classes/validator/telefono-validator';
import { MensajeValidador } from '../classes/validator/txtmensaje-validador';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  constructor() {}
  crearFormularioMensaje(): FormGroup {
    return new FormBuilder().group({
      message: new MensajeValidador(),
    });
  }
  crearFormularioLogin(): FormGroup {
    return new FormBuilder().group({
      correo: new CorreoValidador(),
      clave: new ClaveValidador(),
      recordarme: new RecordarValidador(),
    });
  }

  crearFormularioActualizarPass(): FormGroup {
    return new FormBuilder().group({
      clave: new ClaveValidador(),
      rclave: new RepeatClaveValidador(),
    });
  }
  crearFormularioRol(): FormGroup {
    return new FormBuilder().group({
      nombre: new NombreValidador(),
      descripcion: new DescripcionValidador(),
    });
  }
  crearFormularioCliente(): FormGroup {
    return new FormBuilder().group({
      nombres: new NombreValidador(),
      apellidos: new ApellidoValidador(),
      correo: new CorreoValidador(),
    });
  }
  crearFormularioIntencion(): FormGroup {
    return new FormBuilder().group({
      nombre: new NombreValidador(),
      descripcion: new DescripcionValidador(),
    });
  }
  crearFormularioFrace(): FormGroup {
    return new FormBuilder().group({
      intencion: new IntencionValidador(),
      frace: new FraceValidador(),
      activo: new ActivoValidador(),
    });
  }
  crearFormularioListar(): FormGroup {
    return new FormBuilder().group({
      columna: new ColumnaValidador(),
      search: new SearchValidador(),
      offset: new OffsetVlidador(),
      limit: new LimitVlidador(),
      sort: new SortValidador(),
    });
  }
  crearFormularioUsuario(): FormGroup {
    return new FormBuilder().group({
      nombres: new NombreValidador(),
      apellidos: new ApellidoValidador(),
      telefono: new TelefonoValidador(),
      correo: new CorreoValidador(),
      id_rol: new RolValidador(),
      activo: new ActivoValidador(),
    });
  }
  crearFormularioChatBlog(): FormGroup {
    return new FormBuilder().group({
      correo: new CorreoValidador(),
    });
  }
  crearFormularioDisponibilidad(): FormGroup {
    return new FormBuilder().group({
      dia: new DiaValidador(),
      hora_inicio: new HoraValidador(),
      hora_fin: new HoraValidador(),
      activo: new ActivoValidador(),
    });
  }
}
