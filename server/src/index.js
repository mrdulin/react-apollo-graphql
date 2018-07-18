const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const bodyParser = require('body-parser');
const cors = require('cors');
const { apolloUploadExpress } = require('apollo-upload-server');

const config = require('../../webpack.config');
const { createWsServer } = require('./server');
const { appConfig } = require('./config');
const { schema } = require('./schema');
const { graphiqlExpressHandler, createGraphqlExpressHandler } = require('./middlewares');

const app = express();
const compiler = webpack(config);

createWsServer({
  app,
  port: appConfig.PORT,
  schema,
  wsPath: appConfig.WS_PATH
});

app.use('*', cors({ origin: `http://localhost:${appConfig.PORT}` }));
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  })
);
app.use(appConfig.GRAPHQL_ENDPOINT, bodyParser.json(), apolloUploadExpress(), createGraphqlExpressHandler({ schema }));
app.use(appConfig.GRAPHIQL_ENDPOINT, graphiqlExpressHandler);
