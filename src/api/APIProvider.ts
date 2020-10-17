interface APIPRovider {
  callback: (url: string) => object;
  init(callback: (url: string) => object): void;
}
