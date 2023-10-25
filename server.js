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
        hlsFlags: '[hls_time=2:hls_list_size=20:hls_flags=delete_segments:hls_allow_cache=0]',
      },
    ],
  },
};

const mediaServer = new NodeMediaServer(config);
mediaServer.run();
