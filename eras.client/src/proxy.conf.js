//proxy.conf.js
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:4000';

const PROXY_CONFIG = [
  {
    context: [
      "/api",  // This is for dotnet backend API
    ],
    target: 'https://localhost:4000',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    ws: true
  },
  //{
  //  context: [
  //    "/guacamole", // This is for Guacamole server API
  //  ],
  //  target: 'http://localhost:8080', 
  //  secure: false,
  //  changeOrigin: true,
  //  logLevel: 'debug',
  //  ws: true
  //},
  //{
  //  context: [
  //    "/guacamole/websocket-tunnel", // This is for Websocket
  //  ],
  //  target: 'ws://localhost:8080', 
  //  secure: false,
  //  changeOrigin: true,
  //  logLevel: 'debug',
  //  ws: true
  //},
  //{
  //  context: [
  //    "/tunnel", // This is for HTTPTunnel
  //  ],
  //  target: 'http://localhost:8080',
  //  secure: false,
  //  changeOrigin: true,
  //  logLevel: 'debug',
  //  ws: true
  //},
  //{
  //  context: [
  //    "/WS",
  //  ],
  //  target: 'https://ydsws.azurewebsites.net', 
  //  secure: false,
  //  changeOrigin: true,
  //  logLevel: 'debug'
  //}
]
module.exports = PROXY_CONFIG;
