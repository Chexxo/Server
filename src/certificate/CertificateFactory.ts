import Certificate from "../types/CommonTypes/certificate/Certificate";
import Issuer from "../types/CommonTypes/certificate/Issuer";
import Subject from "../types/CommonTypes/certificate/Subject";

/**
 * The CertificateFactory contains methods which create a certificate from another object.
 */
export default class CertificateFactory {
  /**
   * Creates a certificate object from the https getPeerCertificate response.
   * @param certObject The NodeJS tlsSocket.getPeerCertificate response.
   * @returns The created certificate object.
   */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public static fabricateCertificate(certObject: any): Certificate {
    const issuer = new Issuer(
      certObject.issuer.CN,
      certObject.issuer.O,
      certObject.issuer.OU,
      certObject.issuer.L,
      certObject.issuer.S,
      certObject.issuer.C
    );
    const subject = new Subject(
      certObject.subject.CN,
      certObject.subject.O,
      certObject.subject.OU,
      certObject.subject.L,
      certObject.subject.S,
      certObject.subject.C
    );

    return new Certificate(
      certObject.fingerprint,
      certObject.fingerprint256,
      issuer,
      certObject.serialNumber,
      subject,
      certObject.subjectaltname,
      certObject.valid_from,
      certObject.valid_to,
      false
    );
  }
}
