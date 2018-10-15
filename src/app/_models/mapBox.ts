export class MapBox {
  key: string;
  opacity: number;
  visible: boolean;
  constructor(key: string, opacity: number, visible: boolean) {
    this.key = key;
    this.opacity = opacity;
    this.visible = visible;
  }
}
