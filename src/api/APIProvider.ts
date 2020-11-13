import CertificateProvider from "../certificate/CertificateProvider";

/**
 * Interface for abstracting the APIProvider
 */
export default interface APIProvider {
  /**
   * The init function responsible for starting the APIProvider.
   *
   * @param certificateProvider The certificate provider which
   * will be used by the APIProvider in order to get the
   * {@link RawCertificate} for the url provided.
   **/
  init(certificateProvider: CertificateProvider): void;
}
