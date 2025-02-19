# Record Store

An app to obtain a text based backup of your Spotify Playlists and Albums.

## Running the app locally

1. Once you've cloned the repository locally, at the root of the project, run `npm i`.

2. Next you need to create an app and get a client ID for use with the Spotify Web API.

    - These steps are abridged from Spotify Web API's [getting started guide](https://developer.spotify.com/documentation/web-api/tutorials/getting-started).

    - These steps assume you already have a Spotify account (free or premium).

    1. Login to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard). If necessary, read the latest Developer Terms of Service to complete your account set up.

    2. On the dashboard, click on the _Create app_ button and enter the following information:

        - **App Name**: Record Store _(this could be anything)_
        - **App Description**: _(This can also be anything)_
        - **Redirect URI**: http://127.0.0.1:8080/callback

    3. Get your newly created app's Client ID:
        1. On the dashboard, click on the name of your newly created app.
        2. Click the _Settings_ button.
        3. It should display the Client ID on this page. You will need this in the next step.

3. Create a `.env` file in the project root containing the following:

```
CLIENT_ID="<your_client_id>"
PUBLIC_PATH="/"
REDIRECT_URI_BASE="http://127.0.0.1:8080"
```

`<your_client_id>` is found in your Spotify Web App's settings. Instructions on how to do obtain this can be found in step 2.5.

4. Record Store is now ready to run locally. From the project root, run `npm start`.

5. Webpack dev server should open Record Store automatically. If it doesn't, in your browser, navigate to `http://127.0.0.1:8080`.
