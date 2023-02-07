# Automated WhatsApp Sender

Completely automated WhatsApp message sender created using [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js).

## Usage

- Close the respository / download the zip and extract.
- Make sure you have [NodeJS](https://nodejs.org/en/download/) installed. (Latest LTS release preferred)
- Open terminal in the program directory and run `npm install`
- Once the dependencies are installed, make sure there is data in `data.xlsx`. The excel sheet is pretty self explanatory, with columns explicitly represented.
- Run `runme.bat` to start the program.
- If the script starts failing, just repeat the steps, none of the messages will be repeated.

## Important

- ~~Make sure the phone is always connected to the internet while the script is running. To be absolutely sure, for a huge number of messages, connect the phone to a power source and turn off `Auto-Lock` and keep WhatsApp opened.~~
- ~~The WhatsApp account used should not be enrolled in the "Multi Device Beta" program.~~
- No longer needed since support for the new multi device feature is added.
- Do remember, when logging in on the machine for the first time, you might need to scan the QR Code twice or thrice. This has nothing to do with the script but WhatsApp's own buggy feature.
- The script might be stuck after scanning QR Code for the first time if logging in from a new account. In that case, close it with `ctrl + c` or closing the terminal window. This is again, caused by WhatsApp since it tries to sync all the old messages to the device on first login.
- Your WhatsApp login details are saved in `.wwebjs_auth` in the same folder as the script. If you share this script anywhere, be sure to share it using the github link since anyone having access to `.wwebjs_auth` folder will get access to your WhatsApp account. The folder is by default hidden, to see it use "Show Hidden Files" in File Explorer > View tab. IT IS VERY IMPORTANT THAT THIS FOLDER ISN'T SHARED ANYWHERE UNINTENTIONALLY.
