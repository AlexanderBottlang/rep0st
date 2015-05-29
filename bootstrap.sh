#!/bin/bash

MAIN_DIR=/vagrant
MAIN_USER=vagrant
HOME_DIR=/home/$MAIN_USER

BUILD_DIR=/root/build/

apt-get update
apt-get dist-upgrade -y
apt-get install -y gcc g++ make cmake binutils build-essential unzip checkinstall htop  git postgresql

mkdir -p $BUILD_DIR
cd $BUILD_DIR
git clone https://github.com/eulerto/pg_similarity.git
cd pg_similarity
USE_PGXS=1 make -j2
USE_PGXS=1 make install
