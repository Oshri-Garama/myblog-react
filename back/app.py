from flask import Flask, request, abort, jsonify, make_response, g
import mysql.connector.pooling
import uuid
import bcrypt


# pool = mysql.connector.pooling.MySQLConnectionPool(
#     host = "blog-db.caobksrxxsqg.us-east-1.rds.amazonaws.com",
#     user = "admin",
#     passwd = "Oshri123456",
#     database = "blog",
#     buffered = True,
#     pool_size = 32
# )

pool = mysql.connector.pooling.MySQLConnectionPool(
    host = "localhost",
    user = "root",
    passwd = "123456",
    database = "blog",
    buffered = True,
    pool_size = 32
)

app = Flask(__name__,
            static_folder='../front/build',
            static_url_path='/')


@app.before_request
def before_request():
    g.db = pool.get_connection()


@app.teardown_request
def teardown_request(exception):
    g.db.close()


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.errorhandler(404)
def page_not_found(e):
    return app.send_static_file('index.html')


@app.route('/api/alive')
def alive():
    return "I'm alive (You took it all, but I'm still breathing)"


@app.route('/api/signup', methods=['POST'])
def sign_up():
    data = request.get_json()
    if is_user_exist(data['username']):
        return abort(409)
    query = 'insert into users (full_name, user_name, password) values (%s, %s, %s)'
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    values = (data['fullName'], data['username'], hashed_password)
    cursor = g.db.cursor()
    cursor.execute(query, values)
    new_user_id = cursor.lastrowid
    cursor.close()
    g.db.commit()
    user_record = get_user(new_user_id)
    response = make_response(user_record)
    new_session_id = create_session(new_user_id)
    response.set_cookie('session_id', new_session_id)
    return response


def is_user_exist(user_name):
    query = 'select user_name from users where user_name=%s'
    values = (user_name,)
    cursor = g.db.cursor()
    cursor.execute(query, values)
    user_record = cursor.fetchone()
    cursor.close()
    if user_record:
        return True
    return False


def get_user(user_id):
    query = 'select user_name, user_id, full_name, is_admin from users where user_id= %s'
    values = (user_id,)
    cursor = g.db.cursor()
    cursor.execute(query, values)
    user_record = cursor.fetchone()
    cursor.close()
    headers = ['username', 'userId', 'fullName', 'isAdmin']
    return jsonify(dict(zip(headers, user_record)))


def create_session(user_id):
    session_id = str(uuid.uuid4())
    query = 'insert into sessions (user_id, session_id) values (%s, %s)'
    values = (user_id, session_id)
    cursor = g.db.cursor()
    cursor.execute(query, values)
    cursor.close()
    g.db.commit()
    return session_id


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    query = 'select user_id, user_name, full_name, is_admin, password from users where user_name=%s'
    values = (data['username'],)
    cursor = g.db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    headers = ['userId', 'username', 'fullName', 'isAdmin']
    if not record:
        abort(401)
    user_id = record[0]
    hashed_password = record[4].encode('utf-8')
    if bcrypt.hashpw(data['password'].encode('utf-8'), hashed_password) != hashed_password:
        abort(401)
    session_id = create_session(user_id)
    response = make_response(jsonify(dict(zip(headers, record))))
    response.set_cookie('session_id', session_id)
    return response


@app.route('/api/logout', methods=['POST'])
def logout():
    session_id = request.cookies.get('session_id')
    if not session_id:
        abort(400)
    query = "delete from sessions where session_id = %s"
    values = (session_id,)
    cursor = g.db.cursor()
    cursor.execute(query, values)
    cursor.close()
    g.db.commit()
    response = make_response()
    response.set_cookie('session_id', '', expires=0)
    return response


@app.route('/api/posts/<post_id>')
def get_post(post_id):
    query_select = 'select post_id, full_name, author_id, title, content, image_url, created_at from posts'
    query_join = 'join users on users.user_id = posts.author_id where post_id= %s'
    query = '%s %s' % (query_select, query_join)
    values = (post_id, )
    comments = get_all_comments(post_id)
    tags = get_post_tags(post_id)
    cursor = g.db.cursor()
    cursor.execute(query, values)
    post_record = cursor.fetchone()
    cursor.close()
    headers = ['id', 'author', 'authorId', 'title', 'content', 'imageUrl', 'published']
    post = dict(zip(headers, post_record))
    post_data = {"post": post, "comments": comments, "tags": tags}
    return jsonify(post_data)


@app.route('/api/posts', methods=['GET', 'POST', 'PUT', 'DELETE'])
def manage_posts():
    if request.method == 'GET':
        return get_all_posts()
    elif request.method == 'POST':
        return create_new_post()
    elif request.method == 'PUT':
        return edit_post()
    elif request.method == 'DELETE':
        return delete_post()


def delete_post():
    user_id = check_login()
    data = request.get_json()
    post_id = data['post_id']
    is_post_belongs_to_user(user_id, post_id)  # abort with 401 if not
    deleted_post = get_post(post_id)
    if not deleted_post:
        abort(400)
    delete_post_comments_if_exists(post_id)
    reset_tags(post_id)  # in that case removing tags before deleting the post(if exists)
    delete_query = 'delete from posts where post_id= %s'
    values = (post_id,)
    cursor = g.db.cursor()
    cursor.execute(delete_query, values)
    cursor.close()
    g.db.commit()
    return deleted_post


def is_post_belongs_to_user(user_id, post_id):
    query = 'select author_id from posts where author_id = %s and post_id = %s'
    values = (user_id[0], post_id)
    cursor = g.db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    if not record:
        abort(401)
    return True


def delete_post_comments_if_exists(post_id):
    comments = get_all_comments(post_id)
    if comments:
        query = 'delete from comments where post_id=%s'
        values = (post_id,)
        cursor = g.db.cursor()
        cursor.execute(query, values)
        cursor.close()
        g.db.commit()
        return comments
    return False


def check_login():
    session_id = request.cookies.get('session_id')
    if not session_id:
        abort(401)
    query = "select user_id from sessions where session_id = %s"
    values = (session_id, )
    cursor = g.db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    if not record:
        abort(401)
    return record


@app.route('/api/verify_session')
def verify_session():
    session_id = request.cookies.get('session_id')
    query_select = "select users.user_id, full_name, user_name, is_admin from sessions"
    query_join_user = 'join users on users.user_id = sessions.user_id where session_id = %s'
    query = '%s %s ' % (query_select, query_join_user)
    values = (session_id,)
    cursor = g.db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    if not record:
        return jsonify(verified=False)
    headers = ['userId', 'fullName', 'username', 'isAdmin']
    return jsonify(dict(zip(headers, record)))


def get_all_posts():
    query_select = 'select post_id, author_id, title, content, image_url, created_at, full_name from users'
    query_join_posts = 'join posts on users.user_id = posts.author_id'
    query_order = 'order by post_id desc'
    query = '%s %s %s' % (query_select, query_join_posts, query_order)
    data = []
    cursor = g.db.cursor()
    cursor.execute(query)
    post_records = cursor.fetchall()
    cursor.close()
    headers = ['id', 'authorId', 'title', 'content', 'imageUrl', 'published', 'author']
    for post in post_records:
        data.append(dict(zip(headers, post)))
    return jsonify(data)


@app.route('/api/posts/filter', methods=['POST'])
def filter_posts():
    query_select = 'select distinct (posts.post_id), author_id, title, content, image_url, created_at, full_name ' \
                   'from users'
    query_join_posts = 'join posts on users.user_id = posts.author_id'
    query_join_tags = 'join post_tags on posts.post_id = post_tags.post_id where '
    query = '%s %s %s' % (query_select, query_join_posts, query_join_tags)
    tags = request.get_json()
    num_of_tags = len(tags) - 1
    values = ()
    for i, tag in enumerate(tags):
        tag_id = int(tag['id'])
        values = values + (tag_id, )
        if num_of_tags != i:
            query += 'post_tags.tag_id = %s'
            query += ' or '
    query += 'post_tags.tag_id = %s'
    query_order = ' order by posts.post_id desc'
    query += query_order
    data = []
    cursor = g.db.cursor()
    cursor.execute(query, values)
    post_records = cursor.fetchall()
    cursor.close()
    headers = ['id', 'authorId', 'title', 'content', 'imageUrl', 'published', 'author']
    for post in post_records:
        data.append(dict(zip(headers, post)))
    return jsonify(data)


def get_tag_id(tag_name):
    query = 'select tag_id from tags where name = %s'
    values = (tag_name, )
    cursor = g.db.cursor()
    cursor.execute(query, values)
    tag_id = cursor.fetchone()
    if not tag_id:
        abort(204)  # no content
    cursor.close()
    return tag_id


@app.route('/api/user/posts')
def get_user_posts():
    user_id = check_login()
    query_select = 'select post_id, author_id, title, content, image_url, created_at, full_name from users'
    query_join_posts = 'join posts on users.user_id = posts.author_id where users.user_id = %s'
    query_order = 'order by post_id desc'
    query = '%s %s %s' % (query_select, query_join_posts, query_order)
    data = []
    cursor = g.db.cursor()
    cursor.execute(query, user_id)
    post_records = cursor.fetchall()
    headers = ['id', 'authorId', 'title', 'content', 'imageUrl', 'published', 'author']
    for post in post_records:
        data.append(dict(zip(headers, post)))
    cursor.close()
    return jsonify(data)


def create_new_post():
    user_id = check_login()[0]
    data = request.get_json()
    query = 'insert into posts (author_id, title, content, image_url) values (%s, %s, %s, %s)'
    values = (user_id, data['title'], data['content'], data['imageUrl'])
    cursor = g.db.cursor()
    cursor.execute(query, values)
    new_post_id = cursor.lastrowid
    cursor.close()
    g.db.commit()
    tags = data['tags']
    if tags:
        add_new_tags(new_post_id, tags)
    return get_post(new_post_id)


def edit_post():
    check_login()
    data = request.get_json()
    post_id = data['id']
    query = 'update posts set title = %s, content = %s, image_url = %s where post_id = %s'
    values = (data['title'], data['content'], data['imageUrl'], post_id)
    cursor = g.db.cursor()
    cursor.execute(query, values)
    cursor.close()
    g.db.commit()
    tags = data['tags']
    remove_tags(post_id)  # tags might be removed
    add_new_tags(post_id, tags)
    return get_post(post_id)


def add_new_tags(post_id, tags):
    query = 'insert into tags (name) values (%s)'
    for tag in tags:
        tag_name = tag['name']
        tag_id = check_if_tag_exists(tag_name)
        if not tag_id:
            values = (tag_name, )
            cursor = g.db.cursor()
            cursor.execute(query, values)
            tag_id = cursor.lastrowid
            cursor.close()
            g.db.commit()
        add_tag_to_post(post_id, tag_id)
    return True


# This function responsible for deleting tags if no longer related to any post
def remove_tags(post_id):
    query = 'delete from tags where tag_id = %s'
    tags = get_post_tags(post_id)
    if not tags:
        return []
    reset_tags(post_id)
    for tag in tags:
        tag_id = tag['id']
        belongs_to_others = is_tag_belongs_to_other_post(tag_id)
        if not belongs_to_others:
            values = (tag_id, )
            cursor = g.db.cursor()
            cursor.execute(query, values)
            cursor.close()
            g.db.commit()
    return True


def is_tag_belongs_to_other_post(tag_id):
    query = 'select post_id from post_tags where tag_id = %s'
    values = (tag_id,)
    cursor = g.db.cursor()
    cursor.execute(query, values)
    records = cursor.fetchall()
    cursor.close()
    if len(records) > 0:
        return True
    return False


def check_if_tag_exists(tag_name):
    query = 'select tag_id from tags where name = %s'
    values = (tag_name, )
    cursor = g.db.cursor()
    cursor.execute(query, values)
    tag_record = cursor.fetchone()
    cursor.close()
    if not tag_record:
        return False
    return tag_record[0]  # returns the id


def reset_tags(post_id):
    query = 'delete from post_tags where post_id = %s'
    cursor = g.db.cursor()
    values = (post_id, )
    cursor.execute(query, values)
    cursor.close()
    g.db.commit()
    return True


def add_tag_to_post(post_id, tag_id):
    query = 'insert into post_tags (post_id, tag_id) values (%s, %s)'
    values = (post_id, tag_id)
    cursor = g.db.cursor()
    cursor.execute(query, values)
    cursor.close()
    g.db.commit()
    return get_tag_by_id(tag_id)


def get_tag_by_id(tag_id):
    query = 'select tag_id, name from tags where tag_id = %s'
    values = (tag_id, )
    cursor = g.db.cursor()
    cursor.execute(query, values)
    tag_record = cursor.fetchone()
    cursor.close()
    headers = ['id', 'name']
    return jsonify(dict(zip(headers, tag_record)))


def get_post_tags(post_id):
    query_select = 'select tags.tag_id, name from post_tags'
    query_join_tags = 'join tags on post_tags.tag_id = tags.tag_id where post_id = %s'
    query_ordering = 'order by name desc'
    query = '%s %s %s' % (query_select, query_join_tags, query_ordering)
    values = (post_id, )
    cursor = g.db.cursor()
    cursor.execute(query, values)
    tag_records = cursor.fetchall()
    cursor.close()
    data = []
    headers = ['id', 'name']
    for tag in tag_records:
        id = str(tag[0])
        name = tag[1]
        tag = (id, name)
        data.append(dict(zip(headers, tag)))
    return data


@app.route('/api/tags/<post_id>')
def get_post_tags_route(post_id):
    return jsonify(get_post_tags(post_id))


@app.route('/api/tags', methods=['GET'])
def get_all_tags():
    query = 'select tag_id, name from tags'
    cursor = g.db.cursor()
    cursor.execute(query)
    tag_records = cursor.fetchall()
    cursor.close()
    data = []
    headers = ['id', 'name']
    for tag in tag_records:
        id = str(tag[0])
        name = tag[1]
        tag = (id, name)
        data.append(dict(zip(headers, tag)))
    return jsonify(data)


@app.route('/api/comments/<post_id>', methods=['GET', 'POST'])
def manage_comments(post_id):
    if request.method == 'GET':
        return get_all_comments(post_id)
    else:
        return add_new_comment()


def get_all_comments(post_id):
    query_select = 'select comment_id, post_id, content, user_name from comments'
    query_join_comments = 'join users on users.user_id = comments.user_id where post_id = %s'
    query_order = 'order by comment_id desc'
    query = '%s %s %s' % (query_select, query_join_comments, query_order)
    values = (post_id,)
    data = []
    cursor = g.db.cursor()
    cursor.execute(query, values)
    comment_records = cursor.fetchall()
    cursor.close()
    headers = ['commentId', 'postId', 'content', 'username']
    for comment in comment_records:
        data.append(dict(zip(headers, comment)))
    return data


def add_new_comment():
    user_id = check_login()[0]  # check_login() returns a tuple, need only the number
    data = request.get_json()
    query = 'insert into comments (user_id, post_id, content) values (%s, %s, %s)'
    values = (user_id, data['postId'], data['comment'])
    cursor = g.db.cursor()
    cursor.execute(query, values)
    new_comment_id = cursor.lastrowid
    cursor.close()
    g.db.commit()
    return get_comment(new_comment_id)


def get_comment(comment_id):
    query_select = 'select comment_id, post_id, content, user_name from comments'
    query_join = 'join users on users.user_id = comments.user_id where comment_id= %s'
    query = '%s %s' % (query_select, query_join)
    values = (comment_id, )
    cursor = g.db.cursor()
    cursor.execute(query, values)
    comment_record = cursor.fetchone()
    cursor.close()
    headers = ['commentId', 'postId', 'content', 'username']
    return jsonify(dict(zip(headers, comment_record)))


if __name__ == "__main__":
    app.run()
