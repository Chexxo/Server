import AWSAPIProvider from "./api/AWSAPIProvider";
import ResponseFactory from "./api/ResponseFactory";
import CertificateProvider from "./certificate/CertificateProvider";
import ChexxoServer from "./ChexxoServer";

const awsProvider = new AWSAPIProvider();
const server = new ChexxoServer(
  awsProvider,
  new ResponseFactory(new CertificateProvider())
);
server.init();

export const handler = awsProvider.getCertificate;
