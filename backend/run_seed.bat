@echo off
cd %~dp0
venv\Scripts\python seed_data.py
echo SEED_DONE > seed_signal.txt
