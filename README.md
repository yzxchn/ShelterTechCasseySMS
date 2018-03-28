# ShelterTech Cassey SMS
## Overview
This repository contains code for ShelterTech Cassey SMS, a chatbot that aims to help homeless people, through basic SMS. 
The project is currently under development.

## System Architechture


## Setting up the `local` dev environment
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
