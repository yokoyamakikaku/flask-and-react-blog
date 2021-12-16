import functools
from flask import (Blueprint, g, request, session, jsonify, abort)
from werkzeug.security import check_password_hash, generate_password_hash

from blog.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/api')

@bp.route('/sign_up', methods=['POST'])
def sign_up():

    username = request.json['username']
    password = request.json['password']

    db = get_db()

    db.execute(
        "INSERT INTO user (username, password) VALUES (?, ?)",
        (username, generate_password_hash(password)),
    )
    db.commit()

    return jsonify()


@bp.route('/sign_in', methods=['POST'])
def sign_in():

    username = request.json['username']
    password = request.json['password']

    db = get_db()

    user = db.execute(
        'SELECT * FROM user WHERE username = ?', (username,)
    ).fetchone()

    if not check_password_hash(user['password'], password):
      abort(400)

    session.clear()
    session['user_id'] = user['id']

    return jsonify()


@bp.route('/sign_out', methods=['POST'])
def sign_out():
    session.clear()
    return jsonify()


@bp.route('/current_user', methods=['GET'])
def get_current_user():
    if g.user is None:
        return abort(401)

    user = {}
    user['username'] = g.user['username']

    return jsonify(user)

@bp.route('/signout')
def logout():
    session.clear()
    return jsonify()

@bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = get_db().execute(
            'SELECT * FROM user WHERE id = ?', (user_id,)
        ).fetchone()

def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            abort(403)

        return view(**kwargs)

    return wrapped_view
