#!/bin/bash
#Run gunicorn
PID_FILE=/var/run/gunicorn_labs.pid
WORKERS=1
BIND_ADDRESS=127.0.0.1:8010
WORKER_CLASS=gevent
LOGFILE=/var/log/gunicorn/labs.log

cd /home/outline/Code/Labs
source /home/outline/Code/Labs/venv/bin/activate

gunicorn app:app --pid=$PID_FILE --debug --log-level=debug --workers=$WORKERS --error-logfile=$LOGFILE --bind=$BIND_ADDRESS --worker-class=$WORKER_CLASS
#python manage.py run_gunicorn
