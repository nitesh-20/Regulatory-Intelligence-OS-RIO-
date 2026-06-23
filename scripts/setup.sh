#!/bin/bash

# RIO Agent Bootstrap Setup Script
set -e

echo "=== RIO Agent Platform Initializer ==="

# 1. Generate Python Virtual Environment
echo "-> Creating python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# 2. Install Packages
echo "-> Installing backend requirements..."
pip install -r backend/requirements.txt

# 3. Setup Frontend
echo "-> Installing frontend workspace packages..."
npm install --workspace=frontend

# 4. Config variables
if [ ! -f .env ]; then
  echo "-> Generating local .env configuration file..."
  cp .env.example .env
fi

echo "=== System Bootstrapped Successfully ==="
echo "To start services:"
echo "  1. Run docker-compose: 'docker-compose up -d'"
echo "  2. Run frontend & backend: 'npm run dev:all'"
