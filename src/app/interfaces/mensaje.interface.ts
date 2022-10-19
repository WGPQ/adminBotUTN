import { Usuario } from "./usuarios.interface";

export interface MensageModel {
  id?: string;
  usuario?: Usuario;
  chat: string;
  contenido: string;
  createdAt?: string;
}
