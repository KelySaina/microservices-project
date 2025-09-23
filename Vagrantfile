Vagrant.configure("2") do |config|
  # Box Ubuntu 20.04 (focal)
  config.vm.box = "ubuntu/focal64"

  # Configuration commune à toutes les VM
  config.vm.provider "virtualbox" do |vb|
    vb.memory = 2048
    vb.cpus = 2
  end

  # Master node
  config.vm.define "k8s-master" do |master|
    master.vm.hostname = "k8s-master"
    master.vm.network "private_network", ip: "192.168.56.10"
    master.vm.provision "shell", inline: <<-SHELL
      sudo apt-get update -y
      sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release software-properties-common

      # Installer Docker (nécessaire à containerd)
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
      sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
      sudo apt-get update -y
      sudo apt-get install -y docker-ce docker-ce-cli containerd.io

      # Config containerd
      sudo mkdir -p /etc/containerd
      sudo containerd config default | sudo tee /etc/containerd/config.toml
      sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
      sudo systemctl restart containerd
      sudo systemctl enable containerd

      # Installer kubeadm, kubelet, kubectl
      sudo mkdir -p /etc/apt/keyrings
      curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
      echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list

      sudo apt-get update -y
      sudo apt-get install -y kubelet kubeadm kubectl
      sudo apt-mark hold kubelet kubeadm kubectl

      # Init cluster
      sudo kubeadm init --apiserver-advertise-address=192.168.56.10 --pod-network-cidr=10.244.0.0/16

      # Config kubectl pour l’utilisateur vagrant
      mkdir -p /home/vagrant/.kube
      sudo cp -i /etc/kubernetes/admin.conf /home/vagrant/.kube/config
      sudo chown vagrant:vagrant /home/vagrant/.kube/config

      # Déployer Flannel CNI
      sudo -u vagrant kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml

      # Sauvegarder la commande join
      kubeadm token create --print-join-command > /vagrant/join.sh
    SHELL
  end

  # Worker nodes
  ["k8s-worker1", "k8s-worker2"].each_with_index do |name, i|
    config.vm.define name do |worker|
      worker.vm.hostname = name
      worker.vm.network "private_network", ip: "192.168.56.#{20+i}"

      worker.vm.provision "shell", inline: <<-SHELL
        sudo apt-get update -y
        sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release software-properties-common

        # Installer Docker + containerd
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
        sudo apt-get update -y
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io

        sudo mkdir -p /etc/containerd
        sudo containerd config default | sudo tee /etc/containerd/config.toml
        sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
        sudo systemctl restart containerd
        sudo systemctl enable containerd

        # Installer kubeadm, kubelet, kubectl
        sudo mkdir -p /etc/apt/keyrings
        curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
        echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list

        sudo apt-get update -y
        sudo apt-get install -y kubelet kubeadm kubectl
        sudo apt-mark hold kubelet kubeadm kubectl

        # Exécuter la commande join
        if [ -f /vagrant/join.sh ]; then
          sudo bash /vagrant/join.sh
        fi
      SHELL
    end
  end
end
