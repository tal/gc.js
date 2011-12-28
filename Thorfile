require 'coffee-script'
require 'uglifier'
class Gcjs < Thor
  include Thor::Actions
  DIR = File.dirname(__FILE__)
  
  desc "compile", "compiles tal.js to the current directory"
  method_option :min, :type => :boolean, :default => false, :desc => "minify the output"
  method_option :version, :type => :boolean, :default => false, :desc => "include version in output"
  def compile(target_dir = '.')
    js = []
    coffee = []
    base = "gc"
    
    Dir.chdir(DIR) do
      js << File.read('src/base.js')
      
      %w{event popup_events popup popup_animations popup_group}.each do |cf|
        coffee << File.read("src/#{cf}.coffee")
      end
      
      if options.version?
        base << '-'
        base << File.read('VERSION')
      end
    end
    
    js << CoffeeScript.compile(coffee.join("\n"))
    
    create_file File.join(target_dir,"#{base}.js"), js.join("\n")
    if options.min?
      create_file File.join(target_dir,"#{base}.min.js"), Uglifier.compile(js.join("\n"))
    end
  end
  
end