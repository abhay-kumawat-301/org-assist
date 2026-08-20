#!/bin/sh
echo "1. Building backend 🟠🟠🟠"
npm run build --workspace=backend && echo "Backend build successful 🟢🟢🟢" || echo "Backend build failed 🔴🔴🔴"
echo "2. Building frontend 🟠🟠🟠"
npm run build --workspace=frontend && echo "Frontend build successful 🟢🟢🟢" || echo "Frontend build failed 🔴🔴🔴"