#!/bin/bash

# Setup script for GitHub Actions CI/CD

echo "🚀 Setting up GitHub Actions CI/CD for Pastebin-Lite"

# Create .github directory structure
mkdir -p .github/workflows

# Check if workflows already exist
if [ -f ".github/workflows/ci.yml" ]; then
    read -p "CI workflow already exists. Overwrite? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Copy workflow files
echo "📁 Creating GitHub Actions workflows..."

cat > .github/workflows/ci.yml << 'EOF'
# Paste the CI workflow content from above
EOF

cat > .github/workflows/cd.yml << 'EOF'
# Paste the CD workflow content from above
EOF

cat > .github/workflows/database.yml << 'EOF'
# Paste the database workflow content from above
EOF

# Create GitHub Actions badge
echo "📛 Creating README badge..."

cat >> README.md << 'EOF'

## CI/CD Status

![CI](https://github.com/your-username/pastebin-lite/actions/workflows/ci.yml/badge.svg)
![CD](https://github.com/your-username/pastebin-lite/actions/workflows/cd.yml/badge.svg)

## GitHub Actions Secrets Setup

1. Go to Repository Settings → Secrets and variables → Actions
2. Add the following secrets:

EOF

# Create secrets documentation
cat > GITHUB_SECRETS_SETUP.md << 'EOF'
# GitHub Secrets Setup Guide

## Required Secrets for CI/CD

### Vercel Configuration
1. **VERCEL_TOKEN**
   - Generate at: https://vercel.com/account/tokens
   - Required scopes: Read & Write

2. **VERCEL_ORG_ID**
   - Run: `vercel whoami` or check Vercel dashboard
   - Format: `team_xxxxxxxxxxxxxxxx`

3. **VERCEL_BACKEND_PROJECT_ID**
   - From backend project settings on Vercel
   - Format: `prj_xxxxxxxxxxxxxxxx`

4. **VERCEL_FRONTEND_PROJECT_ID**
   - From frontend project settings on Vercel
   - Format: `prj_xxxxxxxxxxxxxxxx`

### Database Configuration
5. **PRODUCTION_DATABASE_URL**
   - PostgreSQL connection string for production
   - Format: `postgresql://user:password@host:port/database`

6. **STAGING_DATABASE_URL** (Optional)
   - PostgreSQL connection string for staging

### Notifications (Optional)
7. **SLACK_WEBHOOK**
   - For deployment notifications
   - Generate at: Slack App → Incoming Webhooks

## How to Add Secrets

1. Go to your GitHub repository
2. Click on "Settings"
3. Select "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with its value

## Testing the Setup

1. Push to a feature branch
2. Create a Pull Request
3. GitHub Actions will automatically run CI checks
4. Merge to main to trigger production deployment
EOF

# Create issue template for deployment issues
mkdir -p .github/ISSUE_TEMPLATE

cat > .github/ISSUE_TEMPLATE/deployment-issue.md << 'EOF'
---
name: Deployment Issue
about: Report an issue with CI/CD or deployment
title: '[Deployment] '
labels: deployment, bug
assignees: ''

---

## Description
Describe the deployment issue you're experiencing

## Environment
- **Branch:** [e.g., main, feature/x]
- **Commit SHA:** [e.g., abc123]
- **GitHub Actions Run:** [Link to the failed run]

## Error Message