from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

# endpoint for health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Server is running',
        'version': '1.0.0'
    })

if __name__ == '__main__':
    print("Starting Server...")
    app.run(debug=True, port=5000)