#!/bin/bash
cd ~/sales-hub
git add -A
git commit -m "${1:-更新}"
git push origin main
echo "デプロイ完了！"
