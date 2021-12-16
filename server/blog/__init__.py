import os

from flask import Flask
from flask_cors import CORS
from flask_cors.core import ACL_ALLOW_HEADERS, ACL_CREDENTIALS, ALL_METHODS

from . import db
from . import auth
from . import posts

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    CORS(
        app,
        origins="http://localhost:3000",
        supports_credentials=True
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    db.init_app(app)

    @app.route('/')
    def home():
        return 'Blog API'

    app.register_blueprint(auth.bp)
    app.register_blueprint(posts.bp)

    return app
