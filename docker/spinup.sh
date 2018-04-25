##
#
# Insta Admin Insta Docker
# 
# THIS IS FOR DEV ENVIRONMENTS ONLY
# 
# Spins up a mongo docker container (removing any existing one of the name "instaadmin-mongo")
# Spings up a node docker container with running instaadmin node app
# 
# Reqs:
# Need to instaadmin files in subfolder of your HOME folder on mac due to a bug with docker sharing files
# 
# Before you run Install docker
# 
# 1. cd to instaadmin root folder
# 2. do npm install
# 3. the do:
#    bash docker/spinup.sh
##

echo "Spinning up Insta Admin server..."

echo "Creating the docker volume. This will be the persistance layer for your app."

echo "Cleaning up old docker containers."

# Stops and removes existing containers
docker stop instaadmin-mongo > null
docker rm instaadmin-mongo > null
docker stop instaadmin-app > null
docker rm instaadmin-app > null

echo "Starting mongo with data volume mounted"
docker run -d --name instaadmin-mongo -p 27017:27017 -v instaadmin-data:/data/db mongo

default="default"
read -p "Enter the name of the docker machine  [$default]: " machine_name
machine_name=${machine_name:-$default}

echo $machine_name

server_ip=$(docker-machine inspect $machine_name --format '{{ .Driver.IPAddress }}' "$@")


echo 'Machine name: ' $machine_name '. IP: '  $server_ip

default="local"
read -p "Enter the environment your app is running in [$default]: " app_env
app_env=${app_env:-$default}

default="4"
read -p "What version of Node do you want to run [$default]: " node_ver
node_ver=${node_ver:-$default}

echo "Spinning up docker container with node app"
docker run -d -p 80:4000 --name="instaadmin-app" --env MONGO_URI="mongodb://$server_ip:27017/instaadmin_$app_env" --env NODE_ENV="$app_env" -v "$PWD":/usr/src/app -w /usr/src/app node:$node_ver npm start

sleep 3

open "http://$server_ip/dashboard"
