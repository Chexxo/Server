"use strict";

const fs = require("fs");
fs.renameSync("dist/index_aws.js", "dist/index.js")
fs.unlinkSync("dist/api/ExpressAPIProvider.js")
fs.unlinkSync("dist/logger/ExpressPersistenceManager.js")
fs.unlinkSync("dist/logger/ExpressPersistenceManagerConfig.js")