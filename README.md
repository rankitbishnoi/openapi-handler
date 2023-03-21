
# Openapi-handler

[![npm version](https://img.shields.io/npm/v/openapi-handler.svg?style=flat-square)](https://www.npmjs.com/package/openapi-handler) [![npm downloads](https://img.shields.io/npm/dm/openapi-handler.svg?style=flat-square)](https://www.npmjs.com/package/openapi-handler)

## Quickstart
`npm install openapi-handler`

Usage Examples:
1. [JSON schema generator](#json-schema-generator)
2. [Types generator](#types-generator)
3. [API validations](#api-validations)

#### JSON schema generator

Generate json schemas using open api yml.

```js
// schema-generator.js

const { ApiHandler } = require('openapi-handler');

const apihadler = new ApiHandler({
    ymlPath: `${__dirname}/docs/openapi.yml`, // open api yml location
    schemasOutDir: `${__dirname}/src/core/api-schemas`, // json schema out directory
    
    ...
});

async function generate() {
    await apihadler
        .createJSONSchemas()
        .then(() => {
            console.log('schema generated');
        })
        .catch(err => {
            console.log(err);
        });
    
    ...
}

generate();

```

#### Types generator

Generate types from open api yml using following code:

```js
// schema-generator.js

const { ApiHandler } = require('openapi-handler');

const apihadler = new ApiHandler({
    ...

    typesOutDir: `${__dirname}/src/core/types`, // typescript output directory
});

async function generate() {
    ...

    await apihadler
        .createTypes()
        .then(() => {
            console.log('types generated');
        })
        .catch(err => {
            console.log(err);
        });
}

generate();

```

#### API validations

we provide `Validator` class which have validation middlewars to validate both request and response data using json schemas

you can initialize the validator as following:

```js
// validator.js
import Validator from 'openapi-handler/dist/validator';

export const validator = new Validator();


// app.js
import { validator } from './validator.js';

await validator.initialize([
    path.join(__dirname, '..', 'core/api-schemas'), // json schema directory
]);

validator.cacheValidateFunction(['ResourceIdParams#', 'DummyBase#', 'Dummy#']);

```

##### Request validation

```js

const RESOURCE_ID_PARAMS = 'ResourceIdParams#';

router.get(
    '/:id',
    validator.validate({
        params: RESOURCE_ID_PARAMS,
    }),
    (req, res) => {
        res.send();
    }
    enhanceHandler(DummyController.getDummy, {
        responseBody: 'Dummy#',
    }),
);

```

##### Response validation

```js
import { responseValidator } from 'openapi-handler/dist';

const responseBody = {
    responseBody: 'Dummy#',
};

res.send(
    responseValidator.validateAddSerialize(
        responseBody,
        result,
    ),
);

```
