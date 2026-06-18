#!/usr/bin/env ruby
# frozen_string_literal: true

# Sinatra + EventMachine WebSocket chat example.
#
# Run with:  bundle exec ruby app.rb
#   Chat UI:    http://localhost:3000
#   WebSocket:  ws://localhost:8080

require 'eventmachine'
require 'em-websocket'
require 'sinatra/base'
require 'rackup'
require 'haml'

# Shared EventMachine channel — fans out messages from HTTP POSTs to every
# subscribed WebSocket client.
CHANNEL = EM::Channel.new

class ChatApp < Sinatra::Base
  set :bind,      '0.0.0.0'
  set :port,      3000
  set :server,    :puma
  set :logging,   true
  set :show_exceptions, false

  get '/' do
    haml :index
  end

  post '/' do
    CHANNEL.push "POST>: #{params[:text]}"
    status 204
  end
end

# Puma is not EventMachine-aware, so run the HTTP server in a background
# thread while the EM reactor runs the WebSocket server in the main thread.
http_thread = Thread.new do
  Rackup::Handler.get(:puma).run(ChatApp, Host: '0.0.0.0', Port: 3000)
end

# When the EM reactor stops (Ctrl-C), make sure the HTTP thread goes with it.
at_exit { http_thread.kill if http_thread.alive? }

# Main thread: EventMachine reactor + WebSocket server on port 8080.
EventMachine.run do
  EventMachine::WebSocket.start(host: '0.0.0.0', port: 8080) do |ws|
    ws.onopen do
      sid = CHANNEL.subscribe { |msg| ws.send(msg) }
      CHANNEL.push "#{sid} connected!"

      ws.onmessage do |msg|
        CHANNEL.push "<#{sid}>: #{msg}"
      end

      ws.onclose do
        CHANNEL.unsubscribe(sid)
      end
    end
  end
end
