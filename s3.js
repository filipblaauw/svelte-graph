const { exec } = require("child_process");
const packageInfo = require(__dirname + "/package.json");
const bucketName = "dev.blaauw.photo";

const path = `/${packageInfo.name}`;
console.log(path);

exec(
	`aws s3 sync dist/ s3://${bucketName}${path}`
);

console.log(`\ndone: dev.blaauw.photo${path}`);