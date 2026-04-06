# Branching Strategy & Deployment

## Overview
This workspace uses a structured branching strategy with separate branches for preview and production environments.

## Branch Purposes

### `main` (Development)
- Default branch
- Used for ongoing development and feature branches
- **No automatic deployment**
- Merges come from feature branches via pull requests

### `preview` (Staging/Preview)
- Staging environment for testing
- Deployed to Vercel preview deployment
- Use for testing changes before production
- **Deploy trigger**: Commits/PRs to this branch

### `production` (Live)
- Production environment
- Live deployment to Vercel
- Only stable, tested code should be merged here
- **Deploy trigger**: Commits to this branch only
- Merge from `preview` after testing

## Workflow

```
feature-branch
    ↓ (PR)
main (development)
    ↓ (PR - tested features)
preview (staging - automated deploy)
    ↓ (PR - approved & tested)
production (live - automated deploy)
```

## Step-by-Step Process

### 1. Feature Development
```bash
git checkout -b feature/my-feature main
# Make changes
git commit -m "feat: description"
git push origin feature/my-feature
# Create PR to main
```

### 2. Test in Preview
```bash
git checkout preview
git merge main  # or create PR from main to preview
# Vercel automatically deploys changes
# Test at preview environment URL
```

### 3. Promote to Production
```bash
git checkout production
git merge preview  # or create PR from preview to production
# Vercel automatically deploys to production
```

## Vercel Configuration

### Required Setup in Vercel Dashboard

#### For All Projects (Admin-Pages, LP-1, LP-2, LP-3):
1. Go to Project Settings → Git
2. **Production Branch**: Set to `production`
3. **Preview Deployments**: Enabled for `preview` and feature branches
4. **Deploy on Commit**: Enabled
5. **Ignore Build Step**: Uncheck for all branches

### Environment Variables
- `NEXT_PUBLIC_PREVIEW_URL`: Points to preview environment
- Set in `.env.local` or Vercel project settings

## Branch Protection Rules (Recommended)

### `production` branch
- ✅ Require pull request reviews (1-2 reviewers)
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require branches to be up to date before merging
- ✅ Require status checks to pass (TypeScript, Build, Tests)
- ✅ Require signed commits

### `preview` branch
- ✅ Require pull request reviews (1 reviewer)
- ✅ Require status checks to pass

### `main` branch
- ✅ Allow direct pushes for urgent hotfixes only
- ✅ Require pull request reviews (1 reviewer)

## Commands Reference

```bash
# Create feature branch
git checkout -b feature/name main

# Push to preview for testing
git checkout preview
git pull origin main
git push origin preview

# Merge to production (after testing)
git checkout production
git pull origin preview
git push origin production

# View branch status
git branch -a
```

## Important Notes

⚠️ **Never force push to `production`** - Always use merge commits

⚠️ **Keep `production` and `preview` in sync** - Regularly sync preview from production after live releases

⚠️ **Use conventional commits** - Makes changelog generation automatic
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `refactor:` for code refactoring

## Deployment Status

- **Admin-Pages**: Production & Preview environments
- **Template LP-1, LP-2, LP-3**: Production & Preview environments

Preview deployments available on Vercel dashboard.
