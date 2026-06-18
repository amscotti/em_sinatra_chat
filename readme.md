# Sinatra with WebSockets Example

A small demo of pushing real-time messages from Sinatra to the browser over a
WebSocket using **EventMachine** + **em-websocket**.

* Chat UI:    <http://localhost:3000>
* WebSocket:  `ws://localhost:8080`

## Requirements

* [mise](https://mise.jdx.dev/) (or any other Ruby version manager that honors
  `mise.toml`)

## Running

```sh
mise install        # installs the Ruby version pinned in mise.toml
bundle install     # installs gem dependencies
bundle exec ruby app.rb
```

Then open <http://localhost:3000> in your browser.

## How it works

`app.rb` starts two servers in one process:

1. **Puma** (in a background thread) serves the Sinatra chat app on port 3000.
   The `POST /` route publishes a message to the EventMachine channel.
2. **EventMachine** (in the main thread) runs the WebSocket server on port
   8080. Every connected browser subscribes to the channel and receives every
   message pushed to it.

`views/index.haml` is the chat UI; `public/js/app.js` is the WebSocket client
(vanilla JS — no framework).

## Stack

| Component       | Version |
| --------------- | ------- |
| Ruby            | 4.0.5   |
| Sinatra         | ~> 4.2  |
| Rack / rackup   | ~> 3 / ~> 2.2 |
| Puma            | ~> 8.0  |
| HAML            | ~> 7.2  |
| EventMachine    | ~> 1.2  |
| em-websocket    | ~> 0.5  |
