import functools
from flask import (Blueprint, g, request, session, jsonify, abort)
from werkzeug.security import check_password_hash, generate_password_hash

from blog.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/api')

# パスとメソッドの定義
@bp.route('/sign_up', methods=['POST'])
def sign_up():

    # リクエストのパース
    username = request.json['username']
    password = request.json['password']

    # ハッシュ化されたパスワードの生成
    hashed_password = generate_password_hash(password)

    # DBのインスタンスの取得
    db = get_db()

    # SQLの実行: userの作成
    db.execute(
        "INSERT INTO user (username, password) VALUES (?, ?)",
        (username, hashed_password),
    )

    # トランザクションの確定
    db.commit()

    # レスポンスの返却 = OKを明示
    return jsonify()

# パスとメソッドの定義
@bp.route('/sign_in', methods=['POST'])
def sign_in():

    # リクエストのパース
    username = request.json['username']
    password = request.json['password']

    # DBのインスタンスの取得
    db = get_db()

    # SQLの実行: userの取得
    user = db.execute(
        'SELECT * FROM user WHERE username = ?', (username,)
    ).fetchone()

    # パスワードの確認
    if not check_password_hash(user['password'], password):
        # エラーの返却
        abort(400)

    # セッションの初期化
    session.clear()

    # セッションにデータを格納する = ログイン
    session['user_id'] = user['id']

    # レスポンスの返却 = OKを明示
    return jsonify()


# パスとメソッドの定義
@bp.route('/sign_out', methods=['POST'])
def sign_out():
    # セッションの初期 = ログアウト
    session.clear()

    # レスポンスの返却 = OKを明示
    return jsonify()

# パスとメソッドの定義
@bp.route('/current_user', methods=['GET'])
def get_current_user():
    # 認証済みの確認
    if g.user is None:
        # 未認証時のエラーの返却
        return abort(401)

    # ユーザ情報の生成
    user = {}
    user['username'] = g.user['username']

    # ユーザ情報の返却
    return jsonify(user)

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
