import CertificateProvider from "../certificate/CertificateProvider";
import ResponseFactory from "./ResponseFactory";

export default interface APIProvider {
  init(certificateProvider: CertificateProvider): void;
}
