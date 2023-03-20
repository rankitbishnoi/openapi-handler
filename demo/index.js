const { ApiHandler } = require("../dist/index.js");

const apiHandler = new ApiHandler({
  ymlPath: `${__dirname}/openapi.yml`,
  schemasOutDir: `${__dirname}/api-specs`,
  typesOutDir: `${__dirname}/types`,
});
apiHandler.createJSONSchemas().then(() => {
  console.log("Schemas Generated");
});

apiHandler.createTypes().then(() => {
  console.log("types Generated");
});
