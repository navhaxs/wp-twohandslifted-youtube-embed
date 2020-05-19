# YouTube Watch Party Embed

A WordPress plugin that lets you embed youtube videos with autoplay functionality.

Usage: Use the shortcode `[YouTubeWatchParty video_id='qwJMUHEOW5g']`

Note: By default, autoplay will be applied only to the first top-most video on the WordPress page, unless the `autoplay=true` shortcode parameter was explicitly set.

## Shortcode Parameters

| Parameter          | Description | Example
| ------------------ | ----------- | -------
| video_id           | (String) Youtube Video Id | 'qwJMUHEOW5g'
| width              | (Number) Embed width size in pixels           | '853' (Default value: 'inherit')
| height             | (Number) Embed height size in pixels           | '505'
| autoplay             | (Boolean) Whether to enable the functionality provided by this plugin | null

By default, videos autoplay as soon as the page is loaded. This is ideal for e.g. embedding a YouTube Premiere.

### Simulated live stream

Turn any existing normal YouTube video into a 'watch party', when a valid `start_time` is given.

**This means that playback for all viewers will be synced together to the same point in the video (or close to).**

**WARNING - THIS IS UNTESTED (I DIDN't GO AHEAD WITH THIS FEATURE FOR LIVE USE!!!)**

| Parameter          | Description | Example
| ------------------ | ----------- | -------
| start_time         | (ISO 8601 Date String) Start time for a scheduled watch party   | '2020-05-02T21:30:00'
| enable_sync_button | (Boolean) Enable sync button | '1'
| debug              | (Boolean) Test-mode hack will force 'scheduled video for 10 seconds from page load' | '0'

Whilst waiting until the start time, there is a 'waiting' screen . This can be customised:

| Parameter          | Description | Example
| ------------------ | ----------- | -------
| wait_title         | (String) Waiting screen title | "Stay Tuned!"
| wait_text          | (String) Waiting screen text  | "The evening session will begin at 7:30 PM"

If loading the page past the start time, the plugin will catch-up the viewer to the calculated live position in the video.

## Caveats & Limitations

- This implements a rudimental server side sync for the scheduled video launch timer. A much better solution would be to instead have a server push out the events in sync... e.g. via socket.io (but this starts to get out of scope of the WordPress CMS)

- May not work if device's local timezone is something else. Untested.

## License

MIT

Written by Jeremy Wong for Campus Bible Study, May 2020