import { ExpressAPIProvider } from "./api/ExpressAPIProvider";
import { CertificateProvider } from "./certificate/CertificateProvider";
import { ExpressPersistenceManager } from "./logger/ExpressPersistenceManager";
import { ExpressPersistenceManagerConfig } from "./logger/ExpressPersistenceManagerConfig";
import { ChexxoServer } from "./server/ChexxoServer";
import { Logger } from "./shared/logger/Logger";

const logger = new Logger(
  new ExpressPersistenceManager(new ExpressPersistenceManagerConfig())
);

const server = new ChexxoServer(
  new ExpressAPIProvider(),
  new CertificateProvider(),
  logger
);

server.init();
