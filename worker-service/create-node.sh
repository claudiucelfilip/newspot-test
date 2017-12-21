#!/bin/bash

AWS_AK=""
AWS_SK=""
AWS_VPC=''
AWS_REGION=''

NODE_NAME=$1
MTYPE=$2
MACHINE_TYPE=${MTYPE:='t2.small'}

docker-machine create --driver amazonec2 \
    --amazonec2-access-key $AWS_AK \
    --amazonec2-secret-key $AWS_SK \
    --amazonec2-vpc-id "${AWS_VPC}" \
    --amazonec2-region "${AWS_REGION}" \
    --amazonec2-zone "a"
    --amazonec2-instance-type "${MACHINE_TYPE}" \
    ${NODE_NAME}

echo "${NODE_NAME} should be available in a minute."
