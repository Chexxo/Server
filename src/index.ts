const certificateProvider = require("./CertificateProvider.js").CertificateProvider;

//const prov = new certificateProvider();
//const cert = async prov.getCertificate("google.com");

//var certificateProvider = require("./CertificateProvider");

/*exports.handler = async (event: any) => {
    // TODO implement
    const prov = new certificateProvider();
    const cert = await prov.getCertificate("google.com")
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'+cert),
    };
    return response;
};*/

async function duper() {
  const prov = new certificateProvider();
  const cert = await prov.getCertificate("google.com")
  console.log("Hello");
  console.log(cert);
}

duper();
