interface APIProvider {
  init(callback: (url: string) => object): void;
}
