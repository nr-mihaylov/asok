from flask.ext.script import Manager, Server
from app.core import create_app

manager = Manager(create_app)

if __name__ == '__main__':
    manager.run()
