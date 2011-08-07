require 'coffee-script'
class Taljs < Thor
  include Thor::Actions
  
  desc "compile", "foo"
  def compile
    js = []
    coffee = []
    
    Dir.chdir(File.dirname(__FILE__)) do
      js << File.read('src/base.js')
      
      %w{event}.each do |cf|
        coffee << File.read("src/#{cf}.coffee")
      end
    end
    
    js << CoffeeScript.compile(coffee.join("\n"))
    
    create_file "tal.js", js.join("\n")
  end
  
end