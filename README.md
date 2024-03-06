<h1 align="center">
   PiSentry Media Server
</h1>

## Table of Contents

1. [Run the server](#run-server)
2. [Technologies](#technologies)
3. [License](#license)

## <a name="run-server"></a>Run the server

#### 1. Set correct environment variables

Create a `.env` file based on `.env.example` and set values that work for you.

For `FFMPEG_PATH`, you need to provide the path to the FFmpeg executable. See the [FFmpeg website](https://ffmpeg.org/download.html) to install FFmpeg if needed.

#### 2. HTTPS support _(optional)_

To be able to run the server in HTTPS, simply uncomment and set your own correct values for the HTTPS env variables in the `.env` file.
The paths to the files provided in `HTTPS_KEY` and `HTTPS_CERT` variables are always resolved from the `https_certificates/` directory. Place your HTTPS certificates in this directory.

If you need to generate self-signed HTTPS certificates, you can use [mkcert](https://github.com/FiloSottile/mkcert).

If HTTPS was set up properly, you will see the HTTPS server started in the console logs when starting the server.

#### 3. Run the server

There are 2 different ways to run the application, depending on what you want to achieve:
1. To develop the app: Execute `npm run dev` and the server will start and automatically reload when saving new changes.
2. To run the app in production: Execute `npm start` or `pm2 start pm2.config.cjs` to let pm2 manage it for you (you need to have pm2 installed).

## <a name="technologies"></a>Technologies

The media server has been developed with the library [Node-Media-Server](https://github.com/illuspas/Node-Media-Server).

The media server receives an FLV video stream over the RTMP protocol as input and produces, on demand, a playlist of MPEG-TS video files playable over the HLS protocol as output.

The FLV video stream comes from the PiSentry Camera Software and the MPEG-TS playlist is intended to be consumed by the PiSentry Web app.

## <a name="license"></a>License

This project is licensed under the MIT License
