# Simple Chat Application
This is the frontend for the Chat Application

> Note: you'll need the backend application up and running to use this frontend application (https://github.com/damiisdandy/dubbz-chat-api)

## How to run
```
git clone https://github.com/damiisdandy/dubbz-chat-client.git dubbz-chat-client
cd dubbz-chat-client

# setup environmental variables
touch .env
# within the file `.env`, copy the content of `template.env` into `.env`
# then assign the backend url for the running backend application
# e.g REACT_APP_API_URL=http://localhost:8000

# ensure you have yarn installed (https://classic.yarnpkg.com/lang/en/docs/install/)
yarn

# start application
yarn start
```
