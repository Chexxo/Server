import CertificateProvider from "../certificate/CertificateProvider";

export default interface APIProvider {
  init(certificateProvider: CertificateProvider): void;
}
