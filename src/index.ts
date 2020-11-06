import ExpressAPIProvider from "./api/ExpressAPIProvider";
import ResponseFactory from "./api/ResponseFactory";
import CertificateProvider from "./certificate/CertificateProvider";
import ChexxoServer from "./ChexxoServer";

const server = new ChexxoServer(
  new ExpressAPIProvider(),
  new ResponseFactory(new CertificateProvider())
);

server.init();
