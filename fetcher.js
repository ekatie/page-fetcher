const fs = require('fs');
const request = require('request');

const args = process.argv;
const url = args[2];
const localPath = args[3];


request(url, (error, response, body) => {
  if (!error) {
    let fileSize = body.length;
    fs.writeFile(localPath, body, (error) => {
      if (!error) {
        console.log(`Downloaded and saved ${fileSize} bytes to ${localPath}.`);
      }
    });
  } else {
    console.log("Error: There was an issue writing the file.", error);
  }
});
