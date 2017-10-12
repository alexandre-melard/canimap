export class CaniStyle {
  name: string;
  value: any;
  constructor(name: string, value: any) {
      this.name = 'custom.' + name;
      this.value = value;
  }
}
