var http = require("http"),
  httpProxy = require("http-proxy");
//
// Create your proxy server and set the target in the options.
//
httpProxy
  .createProxyServer({
    target: "https://ec2-18-184-62-60.eu-central-1.compute.amazonaws.com:8080",
    secure: false,
    headers: {'content-security-policy': ''}
  })
  .listen(8000); // See (†)
