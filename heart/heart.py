from flask import Flask, request, make_response
import redis
import hashlib, random, string, json

client = redis.StrictRedis(host='localhost', port=6379, db=0, socket_timeout=2)

app = Flask(__name__)

@app.route('/like/', methods=['GET', 'POST'])
def like():
    url = request.args.get('url')
    assert url != None
    m = hashlib.sha1()
    m.update(url)
    url_hash = m.hexdigest()

    like_key = 'like:%s' % url_hash

    response = make_response()

    new_session_cookie = False

    liked = False

    session_id = request.cookies.get('session_id')
    if session_id:
        session = client.get('session:%s' % session_id)
        if session:
            session = json.loads(session)
            if url_hash in session['likes']:
                liked = True
    if not session_id or not session:
        session_id = [''.join(random.choice(string.ascii_uppercase + string.digits)
            for x in range(16))]
        session = {'likes': []}
        new_session_cookie = True

    if request.method == 'POST':
        liked = True
        if url_hash not in session['likes']:
            session['likes'].append(url_hash)
            like_count = client.incr(like_key)
            session['likes'].append(url_hash)
            client.set('session:%s' % session_id, json.dumps(session))
    like_count = client.get(like_key)
    response = make_response(json.dumps({'likes': like_count, 'liked': liked}))
    if new_session_cookie:
        response.set_cookie('session_id',  session_id)
    response.headers['Content-type'] = 'application/json'
    return response

if __name__ == '__main__':
    app.debug = True
    app.run()


