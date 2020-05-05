export class User {
  id: string;
  name: string;
  createdAt: number;
  introduction: string;
  iconUrl: string;

  constructor(id?: string, name?: string) {
    this.id = !!id ? id : '';
    this.name = !!name ? name : '';
  }

  deserialize() {
    return Object.assign({}, this);
  }
}
