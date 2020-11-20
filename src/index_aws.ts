import { AWSAPIProvider } from "./api/AWSAPIProvider";
import { CertificateProvider } from "./certificate/CertificateProvider";
import { ChexxoServer } from "./server/ChexxoServer";

const awsProvider = new AWSAPIProvider();
const server = new ChexxoServer(awsProvider, new CertificateProvider());
server.init();

export const handler = awsProvider.getCertificate;
