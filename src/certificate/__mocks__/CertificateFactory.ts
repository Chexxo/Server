import Certificate from "../../types/CommonTypes/certificate/Certificate";
import Subject from "../../types/CommonTypes/certificate/Subject";
import Issuer from "../../types/CommonTypes/certificate/Issuer";

/**
 * The CertificateFactory contains methods which create a certificate from another object.
 */
export default class CertificateFactory {
  /**
   * Creates a certificate object from the https getPeerCertificate response.
   * @param certObject The NodeJS tlsSocket.getPeerCertificate response.
   * @returns The created certificate object.
   */

  public static fabricateCertificate(certObject: any): Certificate {
    const issuer = new Issuer(
      "example.com",
      "Example INC",
      "IT",
      "Example Street",
      "Example State",
      "Example Country"
    );
    const subject = new Subject(
      "customer.example.com",
      "Example INC",
      "IT",
      "Example Street",
      "Example State",
      "Example Country"
    );

    return new Certificate(
      "72318129210932",
      "23148073210440921432321142091331240",
      issuer,
      456412321545642321,
      subject,
      ["", "", "", ""],
      1604067269,
      1604067277,
      false
    );
  }
}
