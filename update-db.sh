#!/bin/bash

# Usage: ./update-db.sh certidao_portugues

set -e

if [ -z "$1" ]; then
  echo "❌ Error: You must provide the field name as an argument."
  echo "Usage: $0 <field_name>"
  exit 1
fi

FIELD_NAME="$1"
SCHEMA_FILE="prisma/schema.prisma"

if [ ! -f "$SCHEMA_FILE" ]; then
  echo "❌ Error: $SCHEMA_FILE not found."
  exit 1
fi

# Check if the line already has @db.* after the @map("FIELD_NAME")
if grep -q "@map(\"$FIELD_NAME\").*@db" "$SCHEMA_FILE"; then
  echo "⚠️  Field '$FIELD_NAME' already has a @db annotation. No changes made."
  exit 0
fi

# Perform the replacement
sed -i.bak "s/@map(\"$FIELD_NAME\")/@map(\"$FIELD_NAME\") @db.VarChar(255)/" "$SCHEMA_FILE"
echo "✅ Updated field: $FIELD_NAME in $SCHEMA_FILE"

# Run Prisma migration and commit changes
pnpx prisma migrate dev --name alter_${FIELD_NAME}_length_deal_table && \
git add prisma && \
git commit -m "fix: correct ${FIELD_NAME} length size in db"

# Ask if user wants to push to origin
read -p "🚀 Do you want to push the changes to origin? (y/n): " confirm
if [[ "$confirm" =~ ^[Yy]$ ]]; then
  git push origin
  echo "✅ Changes pushed to origin."
else
  echo "ℹ️  Skipped pushing to origin."
fi
