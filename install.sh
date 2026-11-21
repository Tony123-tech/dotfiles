#!/usr/bin/env bash
set -e

echo "⚡ Installing TONYMIC Cyberpunk Workstation Dotfiles..."

mkdir -p ~/.config/fish
mkdir -p ~/vscode-cyber

cp ./fish/config.fish ~/.config/fish/config.fish
cp ./starship/starship.toml ~/.config/starship.toml
cp ./vscode-cyber/rainbow-cursor.css ~/vscode-cyber/rainbow-cursor.css
cp ./vscode-cyber/trail.js ~/vscode-cyber/trail.js

echo "✅ Fish, Starship, and VS Code Cyber Engine files installed!"
echo "👉 Next steps:"
echo "   1. Restart Fish shell: exec fish"
echo "   2. Add vscode-cyber paths to your editor settings.json and run 'Reload Custom CSS and JS'"
