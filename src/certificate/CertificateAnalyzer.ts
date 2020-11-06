import { X509 } from "jsrsasign";

class CertificatePolicy {
  readonly policyoid: string;
}

export default class CertificateAnalyzer {
  public static hasExtendedValidation(rawCert: Buffer): boolean {
    const pemCertificate = CertificateAnalyzer.convertDerToPem(rawCert);

    const analyzerCert = new X509();
    analyzerCert.readCertPEM(pemCertificate);
    const policies = analyzerCert.getExtCertificatePolicies();

    if (policies !== undefined) {
      const extendedValidationPolicy = policies.array.find(
        (element: CertificatePolicy) => element.policyoid === "2.23.140.1.1"
      );
      return extendedValidationPolicy !== undefined;
    }

    return false;
  }

  private static convertDerToPem(der: Buffer): string {
    const prefix = "-----BEGIN CERTIFICATE-----\n";
    const postfix = "-----END CERTIFICATE-----";
    const pemCertificate =
      prefix +
      der
        .toString("base64")
        .match(/.{0,64}/g)
        .join("\n") +
      postfix;

    return pemCertificate;
  }
}
