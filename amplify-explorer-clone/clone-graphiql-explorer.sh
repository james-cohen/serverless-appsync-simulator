#!/bin/bash

# Temp directory for the clone
TMP_DIR="/tmp/amplify-cli"

# Destination directory
DEST_DIR="./"

# Clone the repository
git clone https://github.com/aws-amplify/amplify-cli.git "$TMP_DIR"

# Copy files from the specific directory to your existing repository
cp -r "$TMP_DIR/packages/amplify-graphiql-explorer/"* "$DEST_DIR"

# Clean up the temporary clone
rm -rf "$TMP_DIR"