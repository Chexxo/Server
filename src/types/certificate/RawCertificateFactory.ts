export default abstract class RawCertificateFactory {
  public static convertDerToPem(der: Buffer): string {
    const prefix = "-----BEGIN CERTIFICATE-----";
    const postfix = "-----END CERTIFICATE-----";
    const pemCertificate = prefix + der.toString("base64") + postfix;

    return pemCertificate;
  }
}
