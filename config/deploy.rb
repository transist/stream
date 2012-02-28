set :application, 'stream'

task :production do
  set :env, 'production'
  set :deploy_to, '/var/www/production_stream'
  set :branch, 'new_server'

end

task :staging do
  set :env, 'staging'
  set :deploy_to, '/var/www/beta_stream'
  set :branch, 'new_server'
end

set :repository,  "git@github.com:transist/stream.git"

set :scm, :git

role :web, "50.56.182.70"                          # Your HTTP server, Apache/etc
role :app, "50.56.182.70"                          # This may be the same as your `Web` server
role :db,  "50.56.182.70", :primary => true # This is where Rails migrations will run
role :db,  "50.56.182.70"

set :user, 'deploy'
set :group, 'deploy'

set :deploy_via, :remote_cache

after 'deploy:update_code', 'deploy:configure'

namespace :bundler do
  task :create_symlink, :roles => :app do
    shared_dir = File.join(shared_path, 'bundle')
    release_dir = File.join(current_release, '.bundle')
    run("mkdir -p #{shared_dir} && ln -s #{shared_dir} #{release_dir}")
  end

  task :bundle_new_release, :roles => :app do
    bundler.create_symlink
  end
end

namespace :deploy do
  task :symlink do
    run "rm -f #{current_path} && ln -s #{current_release} #{current_path}"
  end
  
  task :configure, :roles => :app do
    run "sudo rm -rf /var/www/production_stream/current/node_modules/"
    run "cd #{release_path} && sudo npm install ."
    # run "ln -s #{shared_path}/config/database.yml #{current_release}/config/database.yml"
    # run "ln -s #{shared_path}/.rvmrc #{current_release}/.rvmrc"
    run "ln -s #{shared_path}/node_modules #{current_release}/node_modules"
  end
end
namespace :deploy do
  task :start, :roles => :app, :except   => { :no_release => true } do 
  end
  
  task :stop, :roles => :app, :except    => { :no_release => true } do 
  end
  
  task :restart, :roles => :app, :except => { :no_release => true } do
    stop
    start
  end
end