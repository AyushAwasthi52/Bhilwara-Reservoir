# Sync coordinate.json files
# Run this script after editing coordinate.json to sync all files

Write-Host "🔄 Syncing coordinate.json files..." -ForegroundColor Cyan

if (Test-Path "coordinate.json") {
    Copy-Item "coordinate.json" "public\coordinate.json" -Force
    Copy-Item "coordinate.json" "src\data\coordinate.json" -Force
    Write-Host "✅ Synced coordinate.json to:" -ForegroundColor Green
    Write-Host "   - public/coordinate.json" -ForegroundColor Green
    Write-Host "   - src/data/coordinate.json" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 The app reads from: public/coordinate.json" -ForegroundColor Yellow
} else {
    Write-Host "❌ coordinate.json not found in root directory!" -ForegroundColor Red
}

