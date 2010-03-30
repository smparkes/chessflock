require 'sinatra/base'
require 'haml'

module ChessFlock; end

class ChessFlock::Sinatra < ::Sinatra::Base
  set :root, File.expand_path( File.join( File.dirname( File.expand_path(__FILE__) ), "..", ".." ) )
  set :haml, :format => :html5

  if ENV["RACK_ENV"] == "development"
    use Rack::Static, :urls => ["/lib"]
    use Rack::Static, :urls => ["/vendor"]
  end

  get '/' do
    redirect "/play"
  end

  get '/play' do
    @page = "play"
    haml :play
  end

  get '/multi' do
    @page = "multi"
    haml :multi
  end

  def bosh_uri
    "bosh://#{request.env['HTTP_HOST']}/http-bind/#{user}:#{password}@#{hostname}/#{resource}"
  end

  def user
    "chessflock"
  end

  def password
    "chessflock"
  end

  def hostname
    "chessflock"
  end

  def self.words
    @words ||=
      begin
        File.open("words.txt") { |f| f.read.split }
      end
  end

  def resource
    self.class.words[rand(self.class.words.length)].downcase
  end

  def server_name
    raise "hell"
  end

end
