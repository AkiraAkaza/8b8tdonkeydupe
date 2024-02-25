# 8b8tdonkeydupe
Server 8b8t donkey helper bot dupe
 
# How to use
1. Get [Node.js](https://nodejs.org)
2. Downlod and unzip the repo `` git clone https://github.com/AkiraAkaza/8b8tdonkeydupe.git ``
3. Install [Mineflayer](https://github.com/PrismarineJS/mineflayer) with `` npm i mineflayer ``
4. Install [Mineflayer-navigate](https://github.com/PrismarineJS/mineflayer-navigate) with `` npm i mineflayer-navigate ``
5. Edit the config fles
6. Run the script with ``node index.js``

# Config Format [config.json]
```
{
    "admin": ["admin1", "admin2", "admin3"], // team or clan duping with bot
    "host": "anarchy.8b8t.me", // Server IP
    "username": "ExampleUsername", // Bot Username
    "version": "1.12.2", // Bot Version
    "auth_password": "ExamplePassword", // Bot Password when logging in [/login - /register]
}
```

# Full commands
Chat /w bot-username + command
1. *dupe
2. *tpa
3. *kill
4. *dismount

# How to setup in 8b8t server
1. Find a donkey and chat *tpa
2. Accept the bot with the command /tpayes
3. Chat *dupe then open the donkey's inventory
4. Wait for the bot to mount the donkey and then disconnect from the server
5. Collect the kit and then close the inventory
6. Repeat for other kits

#How to setup bot online 24/7
1. Run command npm install pm2
2. pm2 start index.js
   
> Enjoy 

