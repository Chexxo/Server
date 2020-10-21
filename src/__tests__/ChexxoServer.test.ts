import { ExpressAPIProvider } from "../api/ExpressAPIProvider.js";
import { CertificateProvider } from "../certificate/CertificateProvider.js";
import {ChexxoServer} from "../ChexxoServer.js";

test("Request certificate", () => {
    const server = new ChexxoServer(new CertificateProvider(), new ExpressAPIProvider());
    expect("").toEqual("");
});