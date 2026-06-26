@echo off
REM Run this script periodically (manually or via Task Scheduler) to update order statuses
cd /d "%~dp0"
python manage.py update_order_statuses
