import { Usuario } from "./usuarios.interface";

export interface MensageModel {
  id?: string;
  usuario?: Usuario;
  chat: string;
  visto?: boolean;
  contenido: string;
  nuevos?: number;
  createdAt?: string;
}