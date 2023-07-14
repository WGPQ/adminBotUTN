import { Usuario } from "./usuario.interface";

export interface MensageModel {
  id?: string;
  usuario?: Usuario;
  chat: string;
  contenido: string;
  createdAt?: Date;
}
