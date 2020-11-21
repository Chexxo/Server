import { CertificateProvider } from "../certificate/CertificateProvider";
import { Logger } from "../shared/logger/Logger";

/**
 * Interface for abstracting the APIProvider
 */
export interface APIProvider {
  /**
   * The init function responsible for starting the APIProvider.
   *
   * @param certificateProvider The certificate provider which
   * will be used by the APIProvider in order to get the
   * {@link RawCertificate} for the url provided.
   **/
  init(certificateProvider: CertificateProvider, logger: Logger): void;
}
