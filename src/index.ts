import { ExpressAPIProvider } from "./api/ExpressAPIProvider";
import { CertificateProvider } from "./certificate/CertificateProvider";
import { ChexxoServer } from "./ChexxoServer";

//const prov = new certificateProvider();
//const cert = async prov.getCertificate("google.com");

//var certificateProvider = require("./CertificateProvider");

/*
class AWSEvent {
  url: string;
}
exports.handler = async (event: AWSEvent) => {
  const prov = new certificateProvider();
  let response = {};
  try {
    const cert = await prov.getCertificate(event.url);
    response = {
      statusCode: 200,
      body: JSON.stringify(cert),
    };
  } catch (error: any) {
    //TODO Do Something
  }
  return response;
};

async function duper(): Promise<void> {
  const prov = new certificateProvider();
  const cert = await prov.getCertificate("google.com")
  console.log("Hello");
  console.log(cert);
}

duper();
*/

const server = new ChexxoServer(
  new CertificateProvider(),
  new ExpressAPIProvider()
);

server.init();
/*const prov = new CertificateProvider();
prov.getCertificate('www.google.com').then((cert) => {
  console.log("Yay");
  console.log(cert);
}).catch(() => {
  console.log("Nay");
});*/
