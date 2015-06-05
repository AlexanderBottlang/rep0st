#!/bin/bash

sudo apt-get install -y libgsf-1-dev libwebp-dev libfftw3-dev libopenslide-dev libexif-dev libexif-gtk-dev libmatio-dev gtk-doc-tools libmagick++-dev liborc-0.4-dev libcfitsio3-dev libglib2.0-dev libglib2.0-cil-dev libvpx-dev libv4l-dev gawk build-essential pkg-config libxml2-dev gobject-introspection python-gi-dev libgirepository1.0-dev libtiff5-dev

wget -O libvps.tar.gz https://github.com/jcupitt/libvips/archive/v8.0-beta.tar.gz
tar xfv libvps.tar.gz
cd libvips*
./bootstrap.sh
./configure --prefix=/usr/
make -j16
