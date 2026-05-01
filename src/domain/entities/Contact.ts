export interface ContactProps {
  id: string;
  clienteId: string;
  nombre: string;
  cargo: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Contact {
  readonly id: string;
  readonly clienteId: string;
  readonly nombre: string;
  readonly cargo: string;
  readonly email: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: ContactProps) {
    this.id = props.id;
    this.clienteId = props.clienteId;
    this.nombre = props.nombre;
    this.cargo = props.cargo;
    this.email = props.email;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  toPublic() {
    return {
      id: this.id,
      clienteId: this.clienteId,
      nombre: this.nombre,
      cargo: this.cargo,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
