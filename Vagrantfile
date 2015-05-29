# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/trusty64"

  config.vm.hostname = "rep0stvm"

  config.vm.provider :virtualbox do |vb|
    vb.name = "rep0stvm"
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
    vb.memory = 1024
    vb.cpus = 2
  end

  config.vm.network "private_network", ip: "192.168.1.10"

  config.vm.provision :shell, path: "bootstrap.sh", privileged: true

end
