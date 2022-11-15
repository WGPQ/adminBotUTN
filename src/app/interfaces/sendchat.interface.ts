import { Cliente } from "./cliente.interface";

export interface SendChat {
  image?: string;
  comentario: string;
  usuario:Cliente;
}
