import { ExpressAPIProvider } from "../api/ExpressAPIProvider";
import { CertificateProvider } from "../certificate/CertificateProvider";
import {ChexxoServer} from "../ChexxoServer";

test("Initialize Server", () => {
    const expressAPIProvider = new ExpressAPIProvider();
    const server = new ChexxoServer(new CertificateProvider(), expressAPIProvider);
    expressAPIProvider.close();
    expect("").toEqual("");
});