export interface ClientProps {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  estado: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Client {
  readonly id: string;
  readonly nombre: string;
  readonly email: string;
  readonly telefono: string;
  readonly empresa: string;
  readonly estado: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: ClientProps) {
    this.id = props.id;
    this.nombre = props.nombre;
    this.email = props.email;
    this.telefono = props.telefono;
    this.empresa = props.empresa;
    this.estado = props.estado;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  toPublic() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      empresa: this.empresa,
      estado: this.estado,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  isActive(): boolean {
    return this.estado === 'ACTIVO';
  }
}
