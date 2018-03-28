# ShelterTech Cassey SMS
## Overview
This repository contains code for ShelterTech Cassey SMS, a chatbot that aims to help homeless people, through basic SMS. 
The project is currently under development.

## System Architechture
The chatbot contains, for the most part, 3 components:
* Facebook Messenger Platform: provides the user interface. [Cassey's page]() lives there, and the user interacts with the 
  bot by sending and receiving messages to/from the page.   
  Note that we are only using this for the purpose of prototyping. We will switch to a platform that can actually send and 
  receive text messages from the user in the future. 
* Dialogflow Platform: the dialog manager of the bot. Handles most of the NLU and NLG tasks, which includes understanding 
  what the user wants, and responding to their input accordingly, in natural language.
* Node.js based webhook: the program contained in this repository. It basically acts as the middleman between the two 
  components above.   
  For example, when the user sends a message on Messenger, Messenger would send this message to this app, 
  the app would then relay this message to Dialogflow. Dialogflow then tries to understand this message, and sends a response 
  to the webhook, the webhook then passes this message to Messenger to be displayed to the user.   
  The webhook is not doing anything interesting in the example above. Another scenario where it becomes more useful could be 
  when the user asks for resources near them. Dialogflow can't complete this query alone, because it doesn't have any homeless 
  resource data available. Therefore, we can set it up so that it instructs our webhook to query some database, or 3rd party
  API, to complete this task. 

## Setting up the `local` development environment
1. [Install node.js](https://nodejs.org/en/download/). Make sure you can use the `node` command in your terminal. 
2. Clone this repository and open it.
   ```shell
   git clone git@github.com:yzxchn/ShelterTechCasseySMS.git
   cd ShelterTechCasseySMS
   ```
3. Download the required node packages:
   ```shell
   npm install
   ```
   this command would install the packages specified in [`package.json`](ShelterTechCasseySMS/package.json).
4. Acquire the `config` file through email/Slack, and put the file in the root directory of the project.
5. Test and make sure you can run the server successfully: 
   ```shell
   NODE_ENV=local node app.js
   ```
   The `NODE_ENV=local` part tells the app that it is running in the `local` environment, which has different configurations
   compared to, say, the `dev` environment.
6. [Download `ngrok`](https://ngrok.com/download)
7. Start ngrok by typing the following command:
   ```shell
   /path/to/ngrok http <NODE_APP_PORT>
   ```
   where `/path/to/ngrok` is where you put the downloaded file. If it is in your current working directory, then it should be 
   `./ngrok`. `<NODE_APP_PORT>` is the port number the app is running on after you typed the command in step 5.
