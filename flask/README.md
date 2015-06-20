# flask assignment

Requirements:
- py3
- virtualenv
- bash, zsh or similar

## Setup project
```bash
virtualenv --no-site-packages -p /usr/bin/python3.4 venv
source venv/bin/activate
pip install -r requirements.txt
```

## Run server
```
# Activate venv if not activated
source venv/bin/activate

# ...and run Werkzeug server
python manage.py runserver
```
