#!/bin/bash
# =========================================================
# Full Kubernetes Reset Script
# =========================================================

echo "⚠️  WARNING: This will completely remove Kubernetes and all cluster data!"
read -p "Are you sure you want to continue? (yes/no): " confirm
if [[ "$confirm" != "yes" ]]; then
    echo "Aborting..."
    exit 1
fi

echo "🧹 Resetting kubeadm..."
sudo kubeadm reset -f

echo "🗑 Removing CNI configurations..."
sudo rm -rf /etc/cni/net.d

echo "🗑 Removing Kubernetes manifests..."
sudo rm -rf /etc/kubernetes

echo "🧹 Removing kubelet, kubeadm, kubectl binaries..."
sudo apt-get purge -y kubeadm kubectl kubelet kubernetes-cni kube*
sudo apt-get autoremove -y

echo "🧹 Flushing iptables rules..."
sudo iptables -F
sudo iptables -t nat -F
sudo iptables -t mangle -F
sudo iptables -X

echo "🗑 Removing Kubernetes data directories..."
sudo rm -rf /var/lib/etcd
sudo rm -rf /var/lib/kubelet
sudo rm -rf /var/lib/cni
sudo rm -rf /var/run/kubernetes

echo "✅ Kubernetes cleanup completed!"
echo "You can now start a fresh cluster with kubeadm init."
