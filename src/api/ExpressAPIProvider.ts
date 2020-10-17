class ExpressAPIProvider implements APIPRovider {
  callback: (url: string) => object;

  constructor() {
    this.callback = () => {
      throw new Error("Provider not initialized");
    };
  }

  init(callback: (url: string) => object): void {
    this.callback = callback;
  }
}

module.exports.ExpressAPIProvider = ExpressAPIProvider;
