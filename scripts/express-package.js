"use strict";

const fs = require("fs");

let rawdata = fs.readFileSync("package.json");
let packages = JSON.parse(rawdata);
delete packages.devDependencies;
delete packages.scripts;
fs.writeFileSync("dist/package.json", JSON.stringify(packages));
fs.unlinkSync("dist/index_aws.js")
fs.unlinkSync("dist/api/AWSAPIProvider.js")
fs.unlinkSync("dist/logger/AWSPersistenceManager.js")
