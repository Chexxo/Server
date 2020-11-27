import { ExpressAPIProvider } from "./api/ExpressAPIProvider";
import { CertificateProvider } from "./certificate/CertificateProvider";
import { ExpressPersistenceManager } from "./logger/ExpressPersistenceManager";
import { ExpressPersistenceManagerConfig } from "./logger/ExpressPersistenceManagerConfig";
import { ChexxoServer } from "./server/ChexxoServer";
import { Logger } from "./shared/logger/Logger";

let port = Number(process.env.PORT);
if (isNaN(port)) {
  port = 3000;
}

const logger = new Logger(
  new ExpressPersistenceManager(new ExpressPersistenceManagerConfig())
);

const server = new ChexxoServer(
  new ExpressAPIProvider(port),
  new CertificateProvider(),
  logger
);

server.init();
