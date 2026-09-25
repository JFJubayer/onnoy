from flask import Blueprint, jsonify, request, current_app
import json
import os
import datetime

api = Blueprint('api', __name__)

def _read_json(filepath):
    if not os.path.exists(filepath):
        return [] if 'impact' not in filepath else {}
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def _write_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# ── IMPACT ──
@api.route('/impact', methods=['GET'])
def get_impact():
    return jsonify({'ok': True, 'data': _read_json(current_app.config['IMPACT_FILE'])})

@api.route('/impact', methods=['PATCH'])
def update_impact():
    token = request.headers.get('Authorization', '').replace('Bearer ', '').strip()
    if token != current_app.config.get('ADMIN_TOKEN'):
        return jsonify({'ok': False, 'error': 'Unauthorized'}), 401
    
    updates = request.get_json(silent=True) or {}
    data = _read_json(current_app.config['IMPACT_FILE'])
    data.update(updates)
    _write_json(current_app.config['IMPACT_FILE'], data)
    return jsonify({'ok': True, 'data': data})

# ── REQUESTS ──
@api.route('/requests', methods=['POST', 'GET'])
def manage_requests():
    if request.method == 'GET':
        token = request.headers.get('Authorization', '').replace('Bearer ', '').strip()
        if token != current_app.config.get('ADMIN_TOKEN'):
            return jsonify({'ok': False, 'error': 'Unauthorized'}), 401
        return jsonify({'ok': True, 'data': _read_json(current_app.config['REQUESTS_FILE'])})

    new_req = request.get_json(silent=True) or {}
    new_req['submitted_at'] = datetime.datetime.now().isoformat()
    new_req['status'] = 'pending'
    data = _read_json(current_app.config['REQUESTS_FILE'])
    data.append(new_req)
    _write_json(current_app.config['REQUESTS_FILE'], data)
    return jsonify({'ok': True, 'message': 'Request received'})

# ── FACTCHECKS ──
@api.route('/factchecks', methods=['POST', 'GET'])
def manage_factchecks():
    if request.method == 'GET':
        token = request.headers.get('Authorization', '').replace('Bearer ', '').strip()
        if token != current_app.config.get('ADMIN_TOKEN'):
            return jsonify({'ok': False, 'error': 'Unauthorized'}), 401
        return jsonify({'ok': True, 'data': _read_json(current_app.config['FACTCHECKS_FILE'])})

    new_fc = request.get_json(silent=True) or {}
    new_fc['submitted_at'] = datetime.datetime.now().isoformat()
    new_fc['status'] = 'pending'
    data = _read_json(current_app.config['FACTCHECKS_FILE'])
    data.append(new_fc)
    _write_json(current_app.config['FACTCHECKS_FILE'], data)
    return jsonify({'ok': True, 'message': 'Submitted for verification'})

# ── WORKBOOK DOWNLOADS / LEADS ──
@api.route('/downloads', methods=['POST', 'GET'])
def manage_downloads():
    downloads_file = current_app.config.get('DOWNLOADS_FILE', os.path.join(current_app.config.get('DATA_DIR', ''), 'downloads.json'))
    if request.method == 'GET':
        token = request.headers.get('Authorization', '').replace('Bearer ', '').strip()
        if token != current_app.config.get('ADMIN_TOKEN'):
            return jsonify({'ok': False, 'error': 'Unauthorized'}), 401
        return jsonify({'ok': True, 'data': _read_json(downloads_file)})

    new_dl = request.get_json(silent=True) or {}
    new_dl['downloaded_at'] = datetime.datetime.now().isoformat()
    if not new_dl.get('id'):
        new_dl['id'] = f"DL-{int(datetime.datetime.now().timestamp() * 1000)}"
    data = _read_json(downloads_file)
    data.append(new_dl)
    _write_json(downloads_file, data)
    return jsonify({'ok': True, 'message': 'Download logged', 'id': new_dl['id']})

@api.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'timestamp': datetime.datetime.now().isoformat()})

