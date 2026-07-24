[CmdletBinding()]
param(
    [string]$WorkerName = 'cloudbound-guides',
    [string]$CommitMessage = 'Update CloudBound Guides site',
    [switch]$BuildOnly,
    [switch]$SkipInstall,
    [switch]$SkipGitHub
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$siteRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $siteRoot

function Invoke-Checked {
    param(
        [Parameter(Mandatory)] [string]$FilePath,
        [Parameter(Mandatory)] [string[]]$Arguments
    )

    & $FilePath @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code ${LASTEXITCODE}: $FilePath $($Arguments -join ' ')"
    }
}

Write-Host 'CloudBound Guides updater' -ForegroundColor Cyan
Write-Host "Project: $siteRoot"

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCommand) {
    throw 'Node.js 22.13 or newer is required. Install Node.js and run this script again.'
}

$nodeVersionText = (& $nodeCommand.Source --version).TrimStart('v')
$nodeVersion = [version]$nodeVersionText
if ($nodeVersion -lt [version]'22.13.0') {
    throw "Node.js 22.13 or newer is required. Found $nodeVersionText."
}

if (-not $SkipInstall -and -not (Test-Path -LiteralPath 'node_modules')) {
    $npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
    if (-not $npmCommand) { $npmCommand = Get-Command npm -ErrorAction SilentlyContinue }
    if (-not $npmCommand) { throw 'npm is required to install the project dependencies.' }

    Write-Host 'Installing dependencies...' -ForegroundColor Yellow
    Invoke-Checked -FilePath $npmCommand.Source -Arguments @('install')
}

$vinextCli = Join-Path $siteRoot 'node_modules\vinext\dist\cli.js'
$wranglerCli = Join-Path $siteRoot 'node_modules\wrangler\bin\wrangler.js'
if (-not (Test-Path -LiteralPath $vinextCli)) { throw 'vinext is missing. Run npm install and try again.' }
if (-not (Test-Path -LiteralPath $wranglerCli)) { throw 'wrangler is missing. Run npm install and try again.' }

$env:WRANGLER_LOG_PATH = '.wrangler/wrangler.log'
Write-Host 'Building the production site...' -ForegroundColor Yellow
Invoke-Checked -FilePath $nodeCommand.Source -Arguments @($vinextCli, 'build')

if ($BuildOnly) {
    Write-Host 'Build completed. Deployment was skipped.' -ForegroundColor Green
    exit 0
}

$wranglerConfig = Join-Path $siteRoot 'dist\server\wrangler.json'
if (-not (Test-Path -LiteralPath $wranglerConfig)) {
    throw "Build output is missing: $wranglerConfig"
}

Write-Host "Deploying Worker '$WorkerName'..." -ForegroundColor Yellow
Invoke-Checked -FilePath $nodeCommand.Source -Arguments @(
    $wranglerCli,
    'deploy',
    '--config', $wranglerConfig,
    '--name', $WorkerName,
    '--keep-vars'
)

Write-Host 'Update complete.' -ForegroundColor Green
Write-Host "https://$WorkerName.lsantos2000.workers.dev"

if ($SkipGitHub) {
    Write-Host 'GitHub update was skipped.' -ForegroundColor Yellow
    exit 0
}

$gitCommand = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitCommand) {
    throw 'Git is required to update GitHub. Install Git or run with -SkipGitHub.'
}

$branchName = (& $gitCommand.Source branch --show-current).Trim()
if ($LASTEXITCODE -ne 0) {
    throw 'Unable to determine the current Git branch.'
}
if ([string]::IsNullOrWhiteSpace($branchName)) {
    throw 'GitHub update requires a checked-out branch; detached HEAD is not supported.'
}

$originUrl = (& $gitCommand.Source remote get-url origin).Trim()
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($originUrl)) {
    throw "The Git remote 'origin' is not configured."
}

$changes = & $gitCommand.Source status --porcelain
if ($LASTEXITCODE -ne 0) {
    throw 'Unable to read the Git working tree status.'
}

if ($changes) {
    Write-Host 'Committing site updates...' -ForegroundColor Yellow
    Invoke-Checked -FilePath $gitCommand.Source -Arguments @('add', '--all')
    Invoke-Checked -FilePath $gitCommand.Source -Arguments @('commit', '-m', $CommitMessage)
}
else {
    Write-Host 'No new file changes to commit.' -ForegroundColor DarkYellow
}

Write-Host "Pushing branch '$branchName' to GitHub..." -ForegroundColor Yellow
Invoke-Checked -FilePath $gitCommand.Source -Arguments @(
    'push',
    '--set-upstream',
    'origin',
    $branchName
)

Write-Host 'Cloudflare and GitHub are up to date.' -ForegroundColor Green
