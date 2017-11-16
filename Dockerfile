FROM node:boron
RUN apt-get install -y \
  lm-sensors

WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8080
ENTRYPOINT ["/app/entrypoint.sh"]  #<-- my best practise
# ENTRYPOINT ["npm"]
# CMD [ "start" ]

# /app/entrypoint.sh

#!/usr/local/bin/env sh
set -e

echo "starting whatever..."
exec /path/to/npm $@
# ^--- important
# because: if the actual process is not PID 1 in the container then "docker stop" won't stop it, it will stop the shell script, but the actual program.

# because then you can have this entrypoint shellscript that can do stuff like initialization etc
# as long as the last line of the script is "exec" so that it replaces the PID 1 (because the entrypoint.sh is started as PID 1 with the actual thing you want to run in the image)
