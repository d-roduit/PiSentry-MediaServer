import NodeMediaServer from 'node-media-server';

const config = {
  rtmp: {
    port: process.env.RTMP_PORT,
    chunk_size: 2000,
    gop_cache: false,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: process.env.HTTP_PORT,
    mediaroot: './media',
    allow_origin: '*',
  },
  trans: {
    ffmpeg: process.env.FFMPEG_PATH,
    tasks: [
      {
        app: 'pisentry',
        hls: true,
        // See http://underpop.online.fr/f/ffmpeg/help/options-51.htm.gz for hlsFlags details
        hlsFlags: '[hls_time=2:hls_list_size=20:hls_flags=delete_segments+discont_start:hls_allow_cache=0]',
      },
    ],
  },
};

const mediaServer = new NodeMediaServer(config);
mediaServer.run();

/*
 * Handle the automatic shutdown of the stream when it has not been accessed for a specified delay
 */
const existingHlsStreams = {};
const pisentryHlsStreamUrlRegex = new RegExp('^(?<streamPath>/pisentry/[0-9]{1,5})/index(?:[0-9]+\.ts|\.m3u8)$');
const timeoutDelay = 5 * 60 * 1000; // = 5 minutes * 60 seconds/minute * 1000 milliseconds/second

const setStreamShutdownTimeout = (streamPath, timeoutDelay) => {
  if (existingHlsStreams.hasOwnProperty(streamPath)) {
    const timeoutId = existingHlsStreams[streamPath];
    clearTimeout(timeoutId);
  }

  existingHlsStreams[streamPath] = setTimeout(async () => {
    try {
      await fetch(`http://127.0.0.1:${config.http.port}/api/streams${streamPath}`,
          { method: 'DELETE' }
      )
    } catch (err) {
      console.log(`Exception caught while trying to delete stream ${streamPath}`);
    }

    delete existingHlsStreams[streamPath];
  }, timeoutDelay);
};

const onRequestHandler = (req, res) => {
  const matchResult = req.originalUrl.match(pisentryHlsStreamUrlRegex);

  const streamPath = matchResult?.groups?.streamPath;

  if (typeof streamPath !== 'string') {
    return;
  }

  setStreamShutdownTimeout(streamPath, timeoutDelay);
};

mediaServer.nhs.httpServer.on('request', onRequestHandler);

if (typeof mediaServer.nhs.httpsServer !== 'undefined') {
  mediaServer.nhs.httpsServer.on('request', onRequestHandler);
}

mediaServer.on('postPublish', (id, streamPath, args) => {
  setStreamShutdownTimeout(streamPath, timeoutDelay);
});