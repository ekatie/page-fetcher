const fs = require('fs');
const request = require('request');
const readline = require('readline');

const args = process.argv;
const url = args[2];
const localPath = args[3];
const rl = readline.createInterface({input: process.stdin, output: process.stdout});

/**
 * This request function checks for a valid URL, valid filepath, and if the file already exists or not before copying and saving the URL contents into a local file.
 * @param {string} url - URL to copy, entered as a CLI argument
 * @param {string} filepath - Filepath to copy URL contents to, entered as a CLI argument.
 */

request(url, (error, response, body) => {

  // If there was an error with the URL, inform the user
  if (error) {
    return console.log("Error: Invalid URL.");
  }

  // Url is good!
  else if (response.statusCode === 200) {
    let fileSize = body.length;
    if (!error) {

      // Check for valid file path
      fs.stat(localPath, (err, stats) => {
        if (err) {
          if (err.code === 'ENOENT') {

            // Try to write file and return error or success message
            fs.writeFile(localPath, body, (error) => {
              if (error) {
                return console.log("Error: Invalid filepath.");
              }
              else {
                console.log(`Downloaded and saved ${fileSize} bytes to ${localPath}.`);
              }
            });
          } else {
            console.error('Error checking file existence:', err);
          }
        }

        // File already exists, ask for user guidance
        else {
          getUserInput(fileSize);
        }
      });
    }
  }
});

/**
 * This function uses readline to get the user to decide whether or not to overwrite the existing file.
 * @param {number} fileSize - Size of the file to be written.
 */

let getUserInput = (fileSize) => {
  rl.question("This file already exists. Do you want to overwrite it? Y/N ", (answer) => {

    // If yes, write file and log message with size to console
    if (answer.toLowerCase() === 'y') {
      rl.close();
      console.log(`Downloaded and saved ${fileSize} bytes to ${localPath}.`);

      // If no, exit and log message
    } else if (answer.toLowerCase() === 'n') {
      rl.close();
      console.log("File not copied.");
    }

    // If exit typed, close readline
    else if (answer.toLowerCase() === 'exit') {
      rl.close();
    }

    // If invalid input, prompt user to try again
    else {
      // console.log("Invalid input. Please try again.");
      console.log("Invalid input. Please try again.");
      getUserInput();
    }
  });
};