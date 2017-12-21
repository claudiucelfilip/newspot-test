# create master nodes
#
for i in 1 2 3
do
  ./create-node master0$i t2.small
done

# create worker nodes
#
for i in 1 2 3 4 5
do
  ./create-node worker0$i t2.small
done
