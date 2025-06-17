#!/bin/bash
cd ~/BeatSeq
git checkout next
git pull origin next
cd  BeatSeq/server
npm install
pm2 restart beatseq-api