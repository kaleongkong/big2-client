
const hostname = window && window.location && window.location.hostname;
let SERVER_HOST = process.env.REACT_APP_BACKEND_HOST || '';
let WEBSOCKET_HOST = process.env.REACT_APP_BACKEND_HOST || 'ws://192.168.86.134:5000';
if(hostname === 'funbig2.herokuapp.com') {
  SERVER_HOST = 'https://funbig2apis.herokuapp.com';
  WEBSOCKET_HOST = 'ws://funbig2apis.herokuapp.com';
} else if(hostname === 'staging.realsite.com') {
} else if(/^qa/.test(hostname)) {
}

export {SERVER_HOST, WEBSOCKET_HOST};