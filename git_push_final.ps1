$git = "C:\Users\ap328ps\AppData\Local\Programs\Git\cmd\git.exe"
Set-Location "c:\Users\ap328ps\Downloads\prepara-instrutor"

Write-Host "Staging changes..."
& $git add .

Write-Host "Commiting changes..."
& $git commit -m "Ajustes de layout: Simulador no topo, Garantia, Avaliacoes e FAQ"

Write-Host "Pushing to GitHub..."
& $git push origin main
