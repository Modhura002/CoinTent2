const dns = require('dns');
console.log("Setting DNS to Google...");
dns.setServers(['8.8.8.8', '8.8.4.4']);

const hostname = '_mongodb._tcp.cluster0.mongodb.net';

console.log(`Resolving SRV for ${hostname}...`);

dns.resolveSrv(hostname, (err, addresses) => {
  if (err) {
    console.error("DNS Resolution Error:", err);
    console.log("Trying system DNS...");
    // Try without setting servers (system default)
    // We can't easily 'unset', but new process would.
  } else {
    console.log("Success! Addresses:", addresses);
  }
});
