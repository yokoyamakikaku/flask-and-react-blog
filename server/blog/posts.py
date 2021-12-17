from flask import (Blueprint, g, request, abort)
from flask.json import jsonify

from blog.db import get_db
from blog.auth import login_required

def get_post(id, check_author=True):
    post = get_db().execute(
        'SELECT p.id, title, body, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' WHERE p.id = ?',
        (id,)
    ).fetchone()

    if post is None:
        abort(404, f"Post id {id} doesn't exist.")

    if check_author and post['author_id'] != g.user['id']:
        abort(403)

    return post

bp = Blueprint('posts', __name__, url_prefix='/api')

@bp.route('/posts', methods=['POST'])
@login_required
def create():

    title = request.json['title']
    body = request.json['body']

    db = get_db()
    db.execute(
        'INSERT INTO post (title, body, author_id)'
        ' VALUES (?, ?, ?)',
        (title, body, g.user['id'])
    )
    db.commit()

    return jsonify()

@bp.route('/posts', methods=['GET'])
def get_list():
    db = get_db()
    posts = db.execute(
        'SELECT p.id, title, body, created, author_id, username'
        ' FROM post p JOIN user u ON p.author_id = u.id'
        ' ORDER BY created DESC'
    ).fetchall()
    return jsonify([dict(post) for post in posts])

@bp.route('/posts/<int:id>', methods=['GET'])
def get_single(id):
    post = get_post(id)
    return jsonify(dict(post))

@bp.route('/posts/<int:id>', methods=['PUT'])
@login_required
def update(id):
    title = request.json['title']
    body = request.json['body']

    db = get_db()
    db.execute(
        'UPDATE post SET title = ?, body = ?'
        ' WHERE id = ?',
        (title, body, id)
    )
    db.commit()

    return jsonify()

@bp.route('/posts/<int:id>', methods=['DELETE'])
@login_required
def delete(id):
    get_post(id)
    db = get_db()
    db.execute('DELETE FROM post WHERE id = ?', (id,))
    db.commit()
    return jsonify()
