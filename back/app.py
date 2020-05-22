from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector as mysql
import json

db = mysql.connect(
    host = "localhost",
    user = "root",
    passwd = "123456",
    database = "blog"
)

app = Flask(__name__)
CORS(app)


@app.route('/posts', methods=['GET', 'POST'])
def manage_posts():
    if request.method == 'GET':
        return get_all_posts()
    else:
        return create_new_post()


@app.route('/posts/<post_id>', methods=['GET'])
def get_post(post_id):
    query = 'select post_id, author_id, title, content, image_url, created_at from posts where post_id= %s'
    values = (post_id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    post_record = cursor.fetchone()
    headers = ['post id', 'author_id', 'title', 'content', 'image_url', 'created_at']
    cursor.close()
    return jsonify(dict(zip(headers, post_record)))


def get_all_posts():
    query_select = 'select post_id, title, content, image_url, created_at, full_name from posts'
    query_join = 'join users on author_id=user_id'
    query_order = 'order by post_id desc;'
    query = '%s %s %s' % (query_select, query_join, query_order)
    data = []
    cursor = db.cursor()
    cursor.execute(query)
    post_records = cursor.fetchall()
    headers = ['post_id', 'title', 'content', 'image_url', 'created_at', 'full_name']
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