# Context

The context of this repository is described in the following document: [bigbrother README](https://github.com/felixmielcarek/bigbrother/blob/main/README.md).

# Requirements

## Development environment

To run the script you will need [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/).

To install needed dependencies, run the following command:

```shell
npm install
```

## Environment variables

To run this script, you have to create a `.env` file a the root of the project.

Fill this file with the following content:

```
SPOTIFY_CLIENT_ID=my_spotify_client_id
SPOTIFY_CLIENT_SECRET=my_spotify_client_secret
DBAPI_URL=my_dbapi_url
SERVER_PORT=my_server_port
SPOTIFY_REDIRECT_URL=my_spotify_redirect_url
```

Replace `my_spotify_client_id`, `my_spotify_client_secret` and `my_spotify_redirect_url` with the corresponding values from Spotify.

Replace `my_server_port` and `my_dbapi_url` with your own value.
