interface APIProvider {
  init(callback: (url: string) => Promise<Record<string, unknown>>): void;
}
