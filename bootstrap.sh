#!/bin/bash

MAIN_DIR=/vagrant
MAIN_USER=vagrant
HOME_DIR=/home/$MAIN_USER

BUILD_DIR=/root/build/

apt-get update
apt-get dist-upgrade -y
apt-get install -y gcc g++ make cmake binutils build-essential unzip checkinstall htop  git postgresql postgresql-server-dev-all

sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '0.0.0.0'/g" /etc/postgresql/9.3/main/postgresql.conf
sed -i '75ihost       all          all             192.168.1.0/24          trust' /etc/postgresql/9.3/main/pg_hba.conf
service postgresql restart

mkdir -p $BUILD_DIR
cd $BUILD_DIR
git clone https://github.com/eulerto/pg_similarity.git
cd pg_similarity
USE_PGXS=1 make -j2
USE_PGXS=1 make install

cd $HOME_DIR
sudo su postgres -c "psql -c \"CREATE USER vagrant WITH PASSWORD 'vagrant';\""
sudo su postgres -c "psql -c \"CREATE DATABASE rep0st OWNER vagrant;\""
sudo su postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE rep0st to vagrant;\""
sudo su postgres -c "psql -d \"rep0st\" -c \"CREATE EXTENSION pg_similarity;\""
