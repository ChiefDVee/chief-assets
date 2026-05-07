#!/bin/zsh
# shellcheck disable=SC1071
# ============================================================
# Script Name : imagepush.command
# Author      : Devriendt Chief
# Datum       : 2026-05-07
# Last Run    : $(date +'%Y-%m-%d %H:%M:%S')
#
# NOTICE: Internal System Chiefbase/Chiefmobile.
# APOCALYPSE WARNING: Apocalypse alert if misconfigured.
# © Devriendt Chief – Private Internal Tool
# ============================================================

cd ~/CHIEF_TOOLBOX/11_CHIEF_ASSETS || exit 1

# Nieuwe bestanden detecteren
NEW_FILES=$(git status --porcelain | grep -v "^D" | awk '{print $2}')

if [[ -z "$NEW_FILES" ]]; then
  echo "✓ Niets te pushen — alles is up to date."
  exit 0
fi

echo "📦 Nieuwe of gewijzigde bestanden:"
echo "$NEW_FILES"
echo ""

# Commit en push
git add -A
git commit -m "add: assets $(date +'%Y-%m-%d %H:%M')"
git push

echo ""
echo "✓ Gepushed. Raw URLs:"
echo ""

# Print raw URLs voor alle nieuwe bestanden
echo "$NEW_FILES" | while read -r file; do
  [[ -z "$file" ]] && continue
  echo "https://raw.githubusercontent.com/ChiefDVee/chief-assets/main/${file}"
done

echo ""
echo "Done. Druk Enter om te sluiten."
read
