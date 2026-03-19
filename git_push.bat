@echo off
cd /d "d:\NexCart-DL_Project_using_LSTM"
echo === Git Status ===
git status
echo.
echo === Staging all changes ===
git add .
echo.
echo === Committing ===
git commit -m "feat: finalize authentication flow and protected route guards" -m "- Fix React hook order errors in auth-dependent components^
- Add recharts dependency for dashboard analytics^
- Ensure AuthContext properly guards Products, Orders, and Profile pages^
- Fix post-login routing to redirect to home page^
- Resolve module not found errors for recharts^
- Implement full page reload to reflect authenticated state"
echo.
echo === Pushing to origin ===
git push origin main
echo.
echo === Done ===
