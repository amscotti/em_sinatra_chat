require 'rubygems'
require 'em-websocket'
require 'yajl'
require 'haml'
require 'sinatra/base'
require 'thin'

EventMachine.run do
  class App < Sinatra::Base
      get '/' do
          haml :index
      end
  end
  
  @channel = EM::Channel.new

  EventMachine::WebSocket.start(:host => '0.0.0.0', :port => 8080) do |ws|
      ws.onopen {
        sid = @channel.subscribe { |msg| ws.send msg }
        @channel.push "#{sid} connected!"

        ws.onmessage { |msg|
          @channel.push "<#{sid}>: #{msg}"
        }

        ws.onclose {
          @channel.unsubscribe(sid)
        }
      }

  end

  App.run!({:port => 3000})
end