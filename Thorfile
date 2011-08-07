require 'coffee-script'
require 'uglifier'
class Taljs < Thor
  include Thor::Actions
  DIR = "/Users/tatlas/Projects/tal.js"
  
  desc "compile", "compiles tal.js to the current directory"
  method_option :min, :type => :boolean, :default => false, :desc => "minify the output"
  method_option :version, :type => :boolean, :default => false, :desc => "include version in output"
  def compile
    js = []
    coffee = []
    base = "tal"
    
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
    
    create_file "#{base}.js", js.join("\n"), :verbose => false
    if options.min?
      create_file "#{base}.min.js", Uglifier.compile(js.join("\n")), :verbose => false
    end
  end
  
end