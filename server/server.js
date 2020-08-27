var path = require("path");
var webpack = require("webpack");
var webpackMiddleware = require("webpack-dev-middleware");
var webpackConfig = require("../webpack.config.dev");
var server = require("@widgetic/workbench/server");
var info = require("../package.json");
var config = {
  upload_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZXZ1c2VyIiwiY29udGV4dCI6eyJpZCI6ImRldiIsIm5hbWUiOiJ3b3JrYmVuY2gifSwibWF4UXVvdGEiOjEwMDAwMDAwMDAsImF1ZCI6ImZpbGUtdXBsb2FkIiwiZXhwIjoxNjI2MDI3MjA3fQ.0K-mnnGj3Ddj8tYKbXw7KA5fAzVGsx6YWBjeCHixCmg"
};
var compiler = webpack(webpackConfig);

server.proxyWidgeticApi();
server.mockApi(path.resolve(__dirname + "/../lib/"), info, config);

server.loadDocs(__dirname + '/../node_modules/@widgetic/components/docs');

server.use(
  new webpackMiddleware(compiler, {
    publicPath: "/widget/",
    stats: { colors: true, hot: true },
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  })
);
server.use(require("webpack-hot-middleware")(compiler));
