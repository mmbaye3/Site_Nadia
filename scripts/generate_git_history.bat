@echo off
REM Generate a simple textual git history file for the site
if not exist .git (
  echo This directory is not a git repository. Initialize with: git init
  exit /b 1
)
git log --graph --pretty=format:"%h %ad %s" --date=short > git-history.txt
echo Generated git-history.txt
