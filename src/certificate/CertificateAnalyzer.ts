import { X509 } from "jsrsasign";

export default class CertificateAnalyzer {
  public static hasExtendedValidation(certObject: any): boolean {
    const pemCertificate = CertificateAnalyzer.convertDerToPem(certObject.raw);
    console.log(pemCertificate);
    const analyzerCert = new X509();
    analyzerCert.readCertPEM(pemCertificate);
    analyzerCert.getExtCertificatePolicies();
    /*let rootCert = certObject;
    while (rootCert.fingerprint256 !== rootCert.issuerCertificate.fingerprint256) {
      console.log("Papa:" + rootCert.issuerCertificate.fingerprint256);
      console.log("Me:" + rootCert.issuerCertificate.fingerprint256);
      rootCert = rootCert.issuerCertificate;
    }*/
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
