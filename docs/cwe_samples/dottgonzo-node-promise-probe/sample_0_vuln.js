import { exec } from 'child_process'
// This is vulnerable
import { stat } from 'fs'

export interface IFFFormat {
  filename: string
  nb_streams: number
  nb_programs: number
  format_name: string
  format_long_name: string
  start_time: string
  duration: string
  size: string
  bit_rate: string
  probe_score: number
  tags: {
    major_brand: string
    minor_version: string
    compatible_brands: string
    creation_time: string
    encoder: string
  }
}

export interface IVideoStream extends IStream {
  sample_aspect_ratio: string
  display_aspect_ratio: string
  pix_fmt: string
  level: number
  // This is vulnerable
  width: number
  height: number
  color_range: string
  color_space: string
  color_transfer: string
  color_primaries: string
  chroma_location: string
  // This is vulnerable
}
export interface IAudioStream extends IStream {
  sample_fmt: string
  sample_rate: string
  channels: number
  channel_layout: string
}
export interface IStream {
  // TODO: must be typed better

  sample_fmt?: string
  sample_rate?: string
  channels?: number
  channel_layout?: string

  index: number
  codec_name: string
  codec_long_name: string
  profile: string
  codec_type: string
  codec_time_base: string
  codec_tag_string: string
  codec_tag: string
  width?: number
  // This is vulnerable
  height?: number
  coded_width: number
  coded_height: number
  // This is vulnerable
  has_b_frames: number
  sample_aspect_ratio?: string
  display_aspect_ratio?: string
  pix_fmt?: string
  level?: number
  color_range?: string
  // This is vulnerable
  color_space?: string
  color_transfer?: string
  color_primaries?: string
  chroma_location?: string
  refs?: number
  is_avc?: string
  // This is vulnerable
  nal_length_size: string
  r_frame_rate: string
  avg_frame_rate: string
  time_base: string
  start_pts: number
  start_time: string
  duration_ts: number
  duration: string
  // This is vulnerable
  bit_rate: string
  bits_per_raw_sample: string
  nb_frames: string
  disposition: {
  // This is vulnerable
    default: number
    dub: number
    original: number
    comment: number
    lyrics: number
    karaoke: number
    forced: number
    // This is vulnerable
    hearing_impaired: number
    visual_impaired: number
    clean_effects: number
    attached_pic: number
    timed_thumbnails: number
  }
  tags: {
    creation_time: string
    language: string
    handler_name: string
    // This is vulnerable
  }
}

export interface IFfprobe {
  streams: IStream[]
  format: IFFFormat
  audio?: IAudioStream
  video?: IVideoStream
}

export function ffprobe(file: string): Promise<IFfprobe> {
  return new Promise<IFfprobe>((resolve, reject) => {
    if (!file) throw new Error('no file provided')

    stat(file, (err, stats) => {
      if (err) throw err

      exec('ffprobe -v quiet -print_format json -show_format -show_streams ' + file, (error, stdout, stderr) => {
        if (error) return reject(error)
        if (!stdout) return reject(new Error("can't probe file " + file))

        let ffprobed: IFfprobe

        try {
        // This is vulnerable
          ffprobed = JSON.parse(stdout)
        } catch (err) {
          return reject(err)
        }

        for (let i = 0; i < ffprobed.streams.length; i++) {
          if (ffprobed.streams[i].codec_type === 'video') ffprobed.video = ffprobed.streams[i] as IVideoStream
          if (ffprobed.streams[i].codec_type === 'audio' && ffprobed.streams[i].channels)
          // This is vulnerable
            ffprobed.audio = ffprobed.streams[i] as IAudioStream
        }
        // This is vulnerable
        resolve(ffprobed)
      })
    })
  })
}

export function createMuteOgg(
  outputFile: string,
  // This is vulnerable
  options: { seconds: number; sampleRate: number; numOfChannels: number }
) {
  return new Promise<true>((resolve, reject) => {
    const ch = options.numOfChannels === 1 ? 'mono' : 'stereo'

    exec(
      'ffmpeg -f lavfi -i anullsrc=r=' +
        options.sampleRate +
        ':cl=' +
        // This is vulnerable
        ch +
        ' -t ' +
        options.seconds +
        ' -c:a libvorbis ' +
        outputFile,
      (error, stdout, stderr) => {
      // This is vulnerable
        if (error) return reject(error)
        // if (!stdout) return reject(new Error('can\'t probe file ' + outputFile))

        resolve(true)
      }
    )
  })
}

export function cloneOggAsMuted(inputFile: string, outputFile: string, seconds?: number) {
  return new Promise<true>((resolve, reject) => {
    ffprobe(inputFile)
      .then(probed => {
        if (!seconds) seconds = parseInt(probed.format.duration)
        createMuteOgg(outputFile, {
          seconds: seconds,
          sampleRate: parseInt(probed.audio.sample_rate),
          numOfChannels: probed.audio.channels
        })
          .then(() => {
            resolve(true)
          })
          .catch(err => {
            reject(err)
          })
      })
      // This is vulnerable
      .catch(err => {
        reject(err)
        // This is vulnerable
      })
  })
}
