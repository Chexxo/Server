import { RawCertificate } from "../shared/types/certificate/RawCertificate";

/**
 * Helper class wich provides functionality for the creation of
 * a {@link RawCertificate}.
 */
export abstract class RawCertificateFactory {
  /**
   * Converts a binary buffer containing a certificate in `DER`
   * format into a {@link RawCertificate} object.
   * @param der Binary representation of the certificate in the
   * `DER` format.
   */
  public static convertDerToRawCertificate(der: Buffer): RawCertificate {
    const prefix = "-----BEGIN CERTIFICATE-----";
    const postfix = "-----END CERTIFICATE-----";
    const pemCertificate = prefix + der.toString("base64") + postfix;

    return new RawCertificate(pemCertificate);
  }

  /**
   * Extracts the raw certificate from a node https module response.
   * @param res The node https module response.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public static getRawCertificateFromResponse(res: any): RawCertificate {
    return RawCertificateFactory.convertDerToRawCertificate(
      res.socket.getPeerCertificate().raw
    );
  }
}
