import { MensageModel } from "./mensaje.interface";
import { Usuario } from "./usuarios.interface";

export interface Interaction {
    id?: string;
    usuario_created: Usuario;
    usuario_interacted: Usuario;
    lastMessage: MensageModel;
}