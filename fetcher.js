const fs = require('fs');
const request = require('request');
const readline = require('readline');

const args = process.argv;
const url = args[2];
const localPath = args[3];
const rl = readline.createInterface({input: process.stdin, output: process.stdout});

request(url, (error, response, body) => {
  if (!error) {
    if (localPath) {
      rl.question("This file already exists. Do you want to overwrite it? Y/N ", (answer) => {
        if (answer.toLowerCase() === 'y') {
          rl.close();
          let fileSize = body.length;
          fs.writeFile(localPath, body, (error) => {
            if (!error) {
              console.log(`Downloaded and saved ${fileSize} bytes to ${localPath}.`);
            }
          });
        } else if (answer.toLowerCase() === 'n') {
          rl.close();
          console.log("File not copied.");
        } else if (answer.toLowerCase() === 'exit') {
          rl.close();
        } else {
          console.log("Invalid input. Please try again.");
          rl.prompt();
        }
      });
    }
  }
  else {
    console.log("Error: There was an issue writing the file.", error);
  }
});