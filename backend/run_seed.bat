@echo off
cd d:\NexCart-DL_Project_using_LSTM\backend
venv\Scripts\python seed_data.py
echo SEED_DONE > seed_signal.txt
