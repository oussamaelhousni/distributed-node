const zlib = require("zlib");
const http = require("http");
const fs = require("fs");
http
  .createServer((request, response) => {
    const raw = fs.createReadStream(__dirname + "/index.html");
    const acceptEncoding = request.headers["accept-encoding"] || "";
    response.setHeader("Content-Type", "text/plain");
    console.log(acceptEncoding);
    if (acceptEncoding.includes("gzip")) {
      console.log("encoding with gzip");
      response.setHeader("Content-Encoding", "gzip");
      raw.pipe(zlib.createGzip()).pipe(response);
    } else {
      console.log("no encoding");
      raw.pipe(response);
    }
  })
  .listen(process.env.PORT || 1337);

/*
 # Request uncompressed content 
 $ curl http://localhost:1337/
 # Request compressed content and view binary representation
 $ curl -H 'Accept-Encoding: gzip' http://localhost:1337/ | xxd
 # Request compressed content and decompress
 $ curl -H 'Accept-Encoding: gzip' http://localhost:1337/ | gunzip
 $ curl http://localhost:1337/ | wc -c
 $ curl -H 'Accept-Encoding: gzip' http://localhost:1337/ | wc -c
*/
