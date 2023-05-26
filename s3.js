const { exec } = require("child_process");
const packageInfo = require(__dirname + "/package.json");
const bucketName = "dev.blaauw.photo";

const path = `/${packageInfo.name}`;
console.log(path);

exec(
	`aws s3 sync dist/ s3://${bucketName}${path}`
);
exec(
	`aws cloudfront create-invalidation --distribution-id E2OPYA77LY1D9F --paths ${path}/*`
);

console.log(`\ndone: https://dev.blaauw.photo${path}`);