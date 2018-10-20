
const hostname = window && window.location && window.location.hostname;
let SERVER_HOST = process.env.REACT_APP_BACKEND_HOST || '';
let WEBSOCKET_HOST = process.env.REACT_APP_BACKEND_HOST || 'ws://192.168.86.134:5000';
if(hostname === 'realsite.com') {
  SERVER_HOST = 'https://api.realsite.com';
  WEBSOCKET_HOST = 'ws://api.realsite.com';
} else if(hostname === 'staging.realsite.com') {
} else if(/^qa/.test(hostname)) {
}

export {SERVER_HOST, WEBSOCKET_HOST};