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

# Stage eerst, dan detecteren wat er in de commit zit
git add -A
NEW_FILES=$(git diff --cached --name-only)

if [[ -z "$NEW_FILES" ]]; then
  echo "✓ Niets te pushen — alles is up to date."
  exit 0
fi

echo "📦 Nieuwe of gewijzigde bestanden:"
echo "$NEW_FILES"
echo ""

# Commit en push
git commit -m "add: assets $(date +'%Y-%m-%d %H:%M')"
git push

echo ""
echo "✓ Gepushed. Raw URLs:"
echo ""

# Print raw URLs met URL-encoded spaties
echo "$NEW_FILES" | while read -r file; do
  [[ -z "$file" ]] && continue
  encoded=$(echo "$file" | sed 's/ /%20/g')
  echo "https://raw.githubusercontent.com/ChiefDVee/chief-assets/main/${encoded}"
done

echo ""
echo "Done. Druk Enter om te sluiten."
read
