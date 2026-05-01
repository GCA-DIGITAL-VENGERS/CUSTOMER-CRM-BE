export interface ActivityProps {
  id: string;
  clienteId: string;
  tipo: string;
  descripcion: string;
  fecha: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Activity {
  readonly id: string;
  readonly clienteId: string;
  readonly tipo: string;
  readonly descripcion: string;
  readonly fecha: Date;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: ActivityProps) {
    this.id = props.id;
    this.clienteId = props.clienteId;
    this.tipo = props.tipo;
    this.descripcion = props.descripcion;
    this.fecha = props.fecha;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  toPublic() {
    return {
      id: this.id,
      clienteId: this.clienteId,
      tipo: this.tipo,
      descripcion: this.descripcion,
      fecha: this.fecha,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  isValidType(): boolean {
    const validTypes = ['LLAMADA', 'REUNION', 'CORREO', 'NOTA'];
    return validTypes.includes(this.tipo);
  }
}
