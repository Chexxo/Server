import Certificate from "../CommonTypes/certificate/Certificate";

export default interface APIProvider {
  init(callback: (url: string) => Promise<Certificate | string>): void;
}
