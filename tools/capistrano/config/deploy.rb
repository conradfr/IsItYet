# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'isityet'
set :repo_url, 'https://github.com/conradfr/IsItYet.git'

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, "/var/www/#{fetch(:application)}_#{fetch(:stage)}"

# Default value for :scm is :git
# set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty

# Default value for :log_level is :debug
# set :log_level, :debug

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
set :linked_files, fetch(:linked_files, []).push("app/config/app_parameters.yml", "app/config/parameters.yml")

# Default value for linked_dirs is []
set :linked_dirs, fetch(:linked_dirs, []).push('vendor', 'web/bower_components', 'node_modules');

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
set :keep_releases, 3

# For composer task
SSHKit.config.command_map[:composer] = "php #{shared_path.join("composer.phar")}"

# File permissions
set :file_permissions_groups, ["www-data"]
set :file_permissions_chmod_mode, "0774"

set :permission_method, "chmod"
set :use_set_permissions, true

# is set to "web" as default
set :bower_roles, "app"

namespace :deploy do
  after :starting, 'composer:install_executable'
  before "deploy:updated", "deploy:set_permissions:acl"
  before "deploy:updated", "myproject:gassetic"
  before "deploy:updated", "myproject:fixtures"
end

namespace :myproject do

  # run gassetic
  task :gassetic do
    on roles(:app) do
      within release_path do
        execute "gassetic", "build", "--env=#{fetch(:stage)}"
      end
    end
  end

  # update db fixtures
  task :fixtures do
    on roles(:app) do
      within release_path do

        # todo: use migrations
        execute "php", "app/console", "doctrine:schema:update", "--force"


        execute "php", "app/console", "doctrine:fixtures:load", "--append"
      end
    end
  end

end