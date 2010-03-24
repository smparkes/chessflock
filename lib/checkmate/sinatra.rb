require 'sinatra/base'
require 'haml'

module Checkmate; end

class Checkmate::Sinatra < ::Sinatra::Base
  set :root, File.expand_path( File.join( File.dirname( File.expand_path(__FILE__) ), "..", ".." ) )
  set :haml, :format => :html5

  if ENV["RACK_ENV"] == "development"
    use Rack::Static, :urls => ["/lib"]
    use Rack::Static, :urls => ["/vendor"]
  end

  get '/' do
    @page = "index"
    haml :index
  end

  get '/captured' do
    haml :captured
  end

  get '/capture/*' do
    @page = "capture"
    @jid = params[:splat]
    haml :capture
  end

  def bosh_uri
    "bosh://#{request.env['HTTP_HOST']}/http-bind/#{user}:#{password}@#{hostname}/#{resource}"
  end

  def user
    "checkmate"
  end

  def password
    "checkmate"
  end

  def hostname
    "checkmate"
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
