import ExpressAPIProvider from "./api/ExpressAPIProvider";
import CertificateProvider from "./certificate/CertificateProvider";
import ChexxoServer from "./ChexxoServer";

const server = new ChexxoServer(
  new ExpressAPIProvider(),
  new CertificateProvider()
);

server.init();
