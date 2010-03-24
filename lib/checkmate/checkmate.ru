# -*- mode: ruby -*-

require 'kibosh'
require 'checkmate/sinatra'
# require 'async-rack'

use Rack::CommonLogger
use Rack::ShowExceptions
use Rack::Reloader, 0

map "/http-bind" do
  class SyncKeepAliveLength 
    include Rack::Utils

    def initialize app
      @app = app
    end

    def call(env)
      status, headers, body = @app.call(env)
      headers = HeaderHash.new(headers)
      
      if !STATUS_WITH_NO_ENTITY_BODY.include?(status) &&
         !headers['Content-Length'] &&
         !headers['Transfer-Encoding'] && body.respond_to?(:each)

        array = []
        length = 0
        body.each { |chunk| array << chunk; length += bytesize(chunk) }
        body = array
        headers['Content-Length'] = length.to_s
      end

      [status, headers, body]
    end
  end

  if false
    class KeepAliveLength < AsyncRack::AsyncCallback(:SyncKeepAliveLength)
      include AsyncRack::AsyncCallback::SimpleWrapper
    end
  end
  
  # use KeepAliveLength
  use Rack::ContentLength
  # use Rack::Deflater

  run Kibosh.new :hosts => [
                            # ["checkmate", "a"],
                            [%r{}, "127.0.0.1"] ]
end

redirect_to_lib = lambda do |env|
  return [ 302, { 'Location'=> "http://"+env["HTTP_HOST"] + "/lib" + env["REQUEST_PATH"],
                   'Content-Type' => 'text/plain' }, [] ]
end

if ENV["RACK_ENV"] == "development"
  map "/checkmate.js" do
    run redirect_to_lib
  end
end

map "/" do
  use Rack::Lint
  use Rack::ETag
  # use Rack::Deflater
  run Checkmate::Sinatra
end
