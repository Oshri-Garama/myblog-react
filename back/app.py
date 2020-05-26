from flask import Flask, request, abort, jsonify
import mysql.connector as mysql


db = mysql.connect(
    host = "localhost",
    user = "root",
    passwd = "123456",
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
    query = 'insert into users (full_name, user_name, password, is_admin) values (%s, %s, %s, %s)'
    values = (data['fullName'], data['username'], data['password'], 0)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    new_user_id = cursor.lastrowid
    cursor.close()
    return get_user(new_user_id)


def get_user(user_id):
    query = 'select user_name, user_id, full_name, is_admin from users where user_id= %s'
    values = (user_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    post_record = cursor.fetchone()
    headers = ['username', 'userId', 'fullName', 'isAdmin']
    cursor.close()
    return jsonify(dict(zip(headers, post_record)))


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    query = 'select user_name, user_id, full_name, is_admin from users where user_name=%s and password=%s'
    values = (data['username'], data['password'])
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    headers = ['username', 'userId', 'fullName', 'isAdmin']
    if not record:
        abort(401)
    cursor.close()
    return jsonify(dict(zip(headers, record)))


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


def get_all_posts():
    user_id = request.args['userId']
    query_select = 'select post_id, title, content, image_url, created_at, full_name from posts'
    query_join = 'join users on author_id=user_id where user_id=%s'
    query_order = 'order by post_id desc;'
    query = '%s %s %s' % (query_select, query_join, query_order)
    values = (user_id,)
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