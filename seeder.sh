#!/bin/bash
set -e

NODE_ENV=$NODE_ENV node /usr/src/app/seeder.js 2> ${START_LOGDIR}/instaadmin-seeder.log
