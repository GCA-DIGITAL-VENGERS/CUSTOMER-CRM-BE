export interface UserProps {
  id: string;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly isActive: boolean;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  toPublic() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      isActive: this.isActive,
      createdAt: this.createdAt,
    };
  }
}
