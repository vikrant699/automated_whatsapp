// Library and essential declarations
const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const { openFile } = require("macos-open-file-dialog");
const qrcode = require("qrcode-terminal");
const XLSX = require("xlsx");
const readline = require("readline");
const stdin = process.stdin;

// Variables
const min = Math.ceil(1000);
const max = Math.floor(15000);
var results = [];
var file;
var type;
var finalNum;

// Timeout function
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Manage whatsapp client
const send = () => {
  const workbook = XLSX.readFile("./data.xlsx");
  const sheet = workbook.Sheets["Data"];
  results = XLSX.utils.sheet_to_json(sheet);
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
    restartOnAuthFail: true,
    takeoverOnConflict: true,
  });

  client.initialize();

  // Scan QR Code
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  // Send Message
  client.on("ready", async () => {
    for (let i = 0; i < results.length; i++) {
      var number = results[i].Number;
      if (results[i].Send === "Y") {
        // Check if the number is valid
        if (number.toString().length === 10) {
          finalNum = "+91" + number;
        } else if (number.toString().length === 12) {
          finalNum = "+" + number;
        } else if (number.length === 13) {
          finalNum = number;
        } else {
          console.log(number + " is invalid.");
          results[i] = { ...results[i], Status: "Failed" };
          continue;
        }

        results[i].Send = null;

        var chatId = finalNum.substring(1) + "@c.us";
        var isValid = client.isRegisteredUser(chatId);
        if (results[i].Informal === "Y") {
          var text =
            results[i].InformalSalutation +
            " " +
            results[i].Name +
            "! " +
            results[i].InformalMessage;
        } else {
          var text =
            results[i].FormalSalutation +
            " " +
            results[i].Name +
            "\n" +
            results[i].FormalMessage;
        }

        if (isValid) {
          // Conditions for the type of message
          if (type === "message") {
            await client.sendMessage(chatId, text);
            console.log(
              "Sent message to " + results[i].Name + " (" + finalNum + ")" + "."
            );
          } else if (type === "image") {
            const img = MessageMedia.fromFilePath(file);
            await client.sendMessage(chatId, text);
            await client.sendMessage(chatId, img);
            console.log(
              "Sent message to " + results[i].Name + " (" + finalNum + ")" + "."
            );
          } else if (type === "file") {
            const doc = MessageMedia.fromFilePath(file);
            await client.sendMessage(chatId, text);
            await client.sendMessage(chatId, doc, {
              sendMediaAsDocument: true,
            });
            console.log(
              "Sent message to " + results[i].Name + " (" + finalNum + ")" + "."
            );
          }
          results[i] = { ...results[i], Status: "Successful" };
        } else {
          console.log(
            results[i].Name +
              " (" +
              finalNum +
              ") " +
              " is either invalid or not registered on WhatsApp."
          );
          results[i] = { ...results[i], Status: "Failed" };
        }

        workbook.Sheets["Data"] = XLSX.utils.json_to_sheet(results);
        await XLSX.writeFile(workbook, "./data.xlsx");
        await sleep(Math.floor(Math.random() * (max - min + 1) + min)); // Sleep for a random number between 1-15 seconds
      }

      if (results.length - 1 === i) {
        await sleep(60000);
        process.exit();
      }
    }
  });
};

const keybind = () => {
  return new Promise((resolve) => {
    readline.emitKeypressEvents(stdin);
    stdin.setRawMode(true);
    stdin.once("keypress", async (str, key) => {
      stdin.setRawMode(false);
      // Stop the script with ctrl + c
      if (key.ctrl && key.name === "c") {
        process.exit();
      } else if (str === "1") {
        type = "message";
        console.log("========== TEXT ONLY MODE SELECTED ==========");
        send();
      } else if (str === "2") {
        type = "image";
        console.log("========== TEXT + IMAGE / VIDEO MODE SELECTED ==========");
        const file = await openFile("Select a file");
        send();
      } else if (str === "3") {
        type = "file";
        console.log("========== TEXT + DOCUMENT MODE SELECTED ==========");
        const file = await openFile("Select a file");
        send();
      }
      resolve();
    });
  });
};

// Main function
const main = () => {
  console.log("============================================================");
  console.log("Please select what kind of a message would you like to send:");
  console.log("1. TEXT only.");
  console.log("2. TEXT and an IMAGE / VIDEO.");
  console.log("3. TEXT and a FILE (PDFs, DOCUMENTS etc.)");
  keybind();
};

main();
