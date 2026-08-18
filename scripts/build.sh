#!/bin/sh
echo "1. Building backend 🟠🟠🟠"
npm run build --workspace=backend && "Backend build successful 🟢🟢🟢" || "Backend build failed 🔴🔴🔴"
echo "2. Building frontend 🟠🟠🟠"
npm run build --workspace=frontend && "Frontend build successful 🟢🟢🟢" || "Frontend build failed 🔴🔴🔴"