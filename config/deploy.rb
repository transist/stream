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
  set :application, 'beta-ecsel'
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
# set :use_sudo, false

before 'deploy:symlink', 'deploy:assets'
after 'deploy:update_code', 'deploy:configure'


namespace :bundler do
  task :create_symlink, :roles => :app do
    shared_dir = File.join(shared_path, 'bundle')
    release_dir = File.join(current_release, '.bundle')
    run("mkdir -p #{shared_dir} && ln -s #{shared_dir} #{release_dir}")
  end

  task :bundle_new_release, :roles => :app do
    bundler.create_symlink
    # run "cd #{release_path} && bundle install --without development test"
  end
end

# after 'deploy:update_code', 'bundler:bundle_new_release'
# after "deploy", "rvm:trust_rvmrc"


# If you are using Passenger mod_rails uncomment this:
# if you're still using the script/reapear helper you will need
# these http://github.com/rails/irs_process_scripts

namespace :deploy do
  task :symlink do
    run "rm -f #{current_path} && ln -s #{current_release} #{current_path}"
  end
  
  task :configure, :roles => :app do
    # run "ln -s #{shared_path}/config/database.yml #{current_release}/config/database.yml"
    # run "ln -s #{shared_path}/.rvmrc #{current_release}/.rvmrc"
    # run "ln -s #{shared_path}/thin.yml #{current_release}/config/thin.yml"
  end
  
  desc "Compile asets"
  task :assets do
    # run "cd #{release_path}; RAILS_ENV=#{env} rake assets:precompile"
  end
end

namespace :rvm do
  task :trust_rvmrc do
    # run "rvm rvmrc trust #{current_release}"
  end
end

namespace :deploy do
  task :start_solr, :roles => :app, :except   => { :no_release => true } do 
    run "cd #{release_path}; RAILS_ENV=#{env} bundle exec rake sunspot-solr start"
  end
  task :stop_solr, :roles => :app, :except    => { :no_release => true } do 
    run "cd #{release_path}; RAILS_ENV=#{env} bundle exec rake sunspot-solr stop"
  end

  task :start, :roles => :app, :except   => { :no_release => true } do 
    # run "sudo /etc/init.d/thin start"
    # start_solr
  end
  task :stop, :roles => :app, :except    => { :no_release => true } do 
    # run "sudo /etc/init.d/thin stop"
    # stop_solr
  end
  task :restart, :roles => :app, :except => { :no_release => true } do
    # stop
    # start
  end
  
  
end