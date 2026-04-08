git checkout -b gemini-temp
git add .
git commit -m ""
git push origin gemini-temp




git checkout main
git pull origin main
git merge gemini-temp
git push origin main