import { AWSAPIProvider } from "./api/AWSAPIProvider";
import { CertificateProvider } from "./certificate/CertificateProvider";
import { AWSPersistenceManager } from "./logger/AWSPersistenceManager";
import { ChexxoServer } from "./server/ChexxoServer";
import { Logger } from "./shared/logger/Logger";

const logger = new Logger(new AWSPersistenceManager());
const awsProvider = new AWSAPIProvider();
const server = new ChexxoServer(awsProvider, new CertificateProvider(), logger);
server.init();

export const handler = awsProvider.getCertificate;
