export interface OpportunityProps {
  id: string;
  clienteId: string;
  titulo: string;
  valor: number;
  etapa: string;
  fechaCierre: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Opportunity {
  readonly id: string;
  readonly clienteId: string;
  readonly titulo: string;
  readonly valor: number;
  readonly etapa: string;
  readonly fechaCierre: Date;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: OpportunityProps) {
    this.id = props.id;
    this.clienteId = props.clienteId;
    this.titulo = props.titulo;
    this.valor = props.valor;
    this.etapa = props.etapa;
    this.fechaCierre = props.fechaCierre;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  toPublic() {
    return {
      id: this.id,
      clienteId: this.clienteId,
      titulo: this.titulo,
      valor: this.valor,
      etapa: this.etapa,
      fechaCierre: this.fechaCierre,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  isClosedWon(): boolean {
    return this.etapa === 'CERRADA';
  }

  canAdvance(): boolean {
    const stages = ['PROSPECCION', 'PROPUESTA', 'NEGOCIACION', 'CERRADA'];
    const currentIndex = stages.indexOf(this.etapa);
    return currentIndex < stages.length - 1;
  }
}
