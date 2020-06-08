from flask import Flask, request, abort, jsonify, make_response
import mysql.connector as mysql
import uuid
import bcrypt

db = mysql.connect(
    host = "blog-db.caobksrxxsqg.us-east-1.rds.amazonaws.com",
    user = "admin",
    passwd = "Oshri123456",
    database = "blog"
)

app = Flask(__name__,
            static_folder='../front/build',
            static_url_path='/')


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/signup', methods=['POST'])
def sign_up():
    data = request.get_json()
    if is_user_exist(data['username']):
        return abort(409)
    query = 'insert into users (full_name, user_name, password) values (%s, %s, %s)'
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    values = (data['fullName'], data['username'], hashed_password)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    new_user_id = cursor.lastrowid
    cursor.close()
    return get_user(new_user_id)


def is_user_exist(user_name):
    query = 'select user_name from users where user_name=%s'
    values = (user_name,)
    cursor = db.cursor()
    cursor.execute(query, values)
    user_record = cursor.fetchone()
    cursor.close()
    if user_record:
        return True


def get_user(user_id):
    query = 'select user_name, user_id, full_name, is_admin from users where user_id= %s'
    values = (user_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    user_record = cursor.fetchone()
    headers = ['username', 'userId', 'fullName', 'isAdmin']
    session_id = str(uuid.uuid4())
    query = 'insert into sessions (user_id, session_id) values (%s, %s) on duplicate key update session_id=%s'
    values = (user_id, session_id, session_id)
    cursor.execute(query, values)
    db.commit()
    response = make_response(jsonify(dict(zip(headers, user_record))))
    response.set_cookie('session_id', session_id)
    cursor.close()
    return response


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    query = 'select user_id, user_name, full_name, is_admin, password from users where user_name=%s'
    values = (data['username'],)
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    headers = ['userId', 'username', 'fullName', 'isAdmin']
    if not record:
        abort(401)
    user_id = record[0]
    hashed_password = record[4].encode('utf-8')
    if bcrypt.hashpw(data['password'].encode('utf-8'), hashed_password) != hashed_password:
        abort(401)
    session_id = str(uuid.uuid4())
    query = 'insert into sessions (user_id, session_id) values (%s, %s) on duplicate key update session_id=%s'
    values = (user_id, session_id, session_id)
    cursor.execute(query, values)
    db.commit()
    response = make_response(jsonify(dict(zip(headers, record))))
    response.set_cookie('session_id', session_id)
    cursor.close()
    return response


@app.route('/logout', methods=['POST'])
def logout():
    session_id = request.cookies.get('session_id')
    if not session_id:
        abort(400)
    query = "delete from sessions where session_id = %s"
    values = (session_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    response = make_response()
    response.set_cookie('session_id', '', expires=0)
    return response


@app.route('/posts', methods=['GET', 'POST'])
def manage_posts():
    if request.method == 'GET':
        return get_all_posts()
    else:
        return create_new_post()


@app.route('/posts/<post_id>')
def get_post(post_id):
    query = 'select post_id, author_id, title, content, image_url, created_at from posts where post_id= %s'
    values = (post_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    post_record = cursor.fetchone()
    headers = ['id', 'authorId', 'title', 'content', 'imageUrl', 'published']
    cursor.close()
    return jsonify(dict(zip(headers, post_record)))


def check_login():
    session_id = request.cookies.get('session_id')
    if not session_id:
        abort(401)
    query = "select user_id from sessions where session_id = %s"
    values = (session_id, )
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    if not record:
        abort(401)
    return record


def get_all_posts():
    values = check_login()
    query_select = 'select post_id, title, content, image_url, created_at, full_name, session_id from users'
    query_join_sessions = 'join sessions on users.user_id = sessions.user_id'
    query_join_posts = 'join posts on users.user_id = posts.author_id where users.user_id=%s'
    query_order = 'order by post_id desc;'
    query = '%s %s %s %s' % (query_select, query_join_sessions, query_join_posts, query_order)
    data = []
    cursor = db.cursor()
    cursor.execute(query, values)
    post_records = cursor.fetchall()
    headers = ['id', 'title', 'content', 'imageUrl', 'published', 'author']
    for post in post_records:
        data.append(dict(zip(headers, post)))
    cursor.close()
    return jsonify(data)


def create_new_post():
    data = request.get_json()
    query = 'insert into posts (author_id, title, content, image_url) values (%s, %s, %s, %s)'
    values = (data['authorId'], data['title'], data['content'], data['imageUrl'])
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    new_post_id = cursor.lastrowid
    cursor.close()
    return get_post(new_post_id)


if __name__ == "__main__":
    app.run()