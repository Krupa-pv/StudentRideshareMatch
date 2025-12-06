from flask import Flask, jsonify, request
from flask_cors import CORS
import db_operations as db
from db_config import test_connection

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Test database connection on startup


@app.before_request
def before_first_request():
    if not hasattr(app, 'db_tested'):
        if test_connection():
            print("Database connection successful!")
        else:
            print("WARNING: Database connection failed!")
        app.db_tested = True

# ==================== STUDENT ROUTES ====================


@app.route('/api/students', methods=['GET'])
def get_students():
    """Get all students"""
    students = db.view_all_students()
    return jsonify([{
        'case_id': s[0],
        'full_name': s[1],
        'year_of_study': s[2],
        'group_id': s[3]
    } for s in students])


@app.route('/api/students', methods=['POST'])
def add_student():
    """Add a new student"""
    data = request.json
    case_id = data.get('case_id')
    full_name = data.get('full_name')
    year_of_study = data.get('year_of_study')

    if not all([case_id, full_name, year_of_study]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if student already exists
    existing_students = db.view_all_students()
    for s in existing_students:
        if s[0] == case_id:
            return jsonify({'error': f'Student with Case ID "{case_id}" already exists'}), 409

    success = db.add_student(case_id, full_name, year_of_study)
    if success:
        return jsonify({'message': 'Student added successfully', 'case_id': case_id}), 201
    return jsonify({'error': 'Failed to add student'}), 500


@app.route('/api/students/<case_id>', methods=['DELETE'])
def delete_student(case_id):
    """Delete a student"""
    if not case_id:
        return jsonify({'error': 'Case ID is required'}), 400

    success = db.delete_student(case_id)
    if success:
        return jsonify({'message': f'Student {case_id} deleted successfully'}), 200
    return jsonify({'error': 'Failed to delete student (student may not exist)'}), 404

# ==================== FLIGHT ROUTES ====================


@app.route('/api/flights', methods=['GET'])
def get_flights():
    """Get all flights"""
    flights = db.view_all_flights()
    return jsonify([{
        'flight_no': f[0],
        'flight_date': str(f[1]),
        'flight_time': str(f[2]),
        'departing_airport': f[3]
    } for f in flights])


@app.route('/api/flights', methods=['POST'])
def add_flight():
    """Add a new flight"""
    data = request.json
    flight_date = data.get('flight_date')
    flight_time = data.get('flight_time')
    departing_airport = data.get('departing_airport', '').upper()

    if not all([flight_date, flight_time, departing_airport]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Auto-generate flight number
    date_part = flight_date.replace("-", "")
    time_part = flight_time.replace(":", "")[:4]
    flight_no = f"{departing_airport}_{date_part}_{time_part}"

    success = db.add_flight(flight_no, flight_date,
                            flight_time, departing_airport)
    if success:
        return jsonify({'message': 'Flight added successfully', 'flight_no': flight_no}), 201
    return jsonify({'error': 'Failed to add flight (might already exist)'}), 500

# ==================== TRAIN ROUTES ====================


@app.route('/api/trains', methods=['GET'])
def get_trains():
    """Get all trains"""
    trains = db.view_all_trains()
    return jsonify([{
        'train_no': t[0],
        'train_date': str(t[1]),
        'train_time': str(t[2]),
        'departing_station': t[3]
    } for t in trains])


@app.route('/api/trains', methods=['POST'])
def add_train():
    """Add a new train"""
    data = request.json
    train_date = data.get('train_date')
    train_time = data.get('train_time')
    departing_station = data.get('departing_station')

    if not all([train_date, train_time, departing_station]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Auto-generate train number
    date_part = train_date.replace("-", "")
    time_part = train_time.replace(":", "")[:4]
    station_code = departing_station.replace(" ", "")[:3].upper()
    train_no = f"{station_code}_{date_part}_{time_part}"

    success = db.add_train(train_no, train_date, train_time, departing_station)
    if success:
        return jsonify({'message': 'Train added successfully', 'train_no': train_no}), 201
    return jsonify({'error': 'Failed to add train (might already exist)'}), 500

# ==================== BOOKING ROUTES ====================


@app.route('/api/bookings/flight', methods=['POST'])
def book_flight():
    """Register student on a flight"""
    data = request.json
    case_id = data.get('case_id')
    flight_no = data.get('flight_no')
    confirmation_code = data.get('confirmation_code')

    if not all([case_id, flight_no, confirmation_code]):
        return jsonify({'error': 'Missing required fields'}), 400

    success = db.book_student_flight(confirmation_code, case_id, flight_no)
    if success:
        return jsonify({'message': 'Flight booked successfully'}), 201
    return jsonify({'error': 'Failed to book flight'}), 500


@app.route('/api/bookings/train', methods=['POST'])
def book_train():
    """Register student on a train"""
    data = request.json
    case_id = data.get('case_id')
    train_no = data.get('train_no')
    confirmation_code = data.get('confirmation_code')

    if not all([case_id, train_no, confirmation_code]):
        return jsonify({'error': 'Missing required fields'}), 400

    success = db.book_student_train(confirmation_code, case_id, train_no)
    if success:
        return jsonify({'message': 'Train booked successfully'}), 201
    return jsonify({'error': 'Failed to book train'}), 500


@app.route('/api/bookings/student/<case_id>', methods=['GET'])
def get_student_bookings(case_id):
    """Get all bookings for a student"""
    flights, trains = db.get_student_bookings(case_id)

    flights_data = [{
        'flight_no': f[0],
        'flight_date': str(f[1]),
        'flight_time': str(f[2]),
        'departing_airport': f[3],
        'confirmation_code': f[4]
    } for f in (flights or [])]

    trains_data = [{
        'train_no': t[0],
        'train_date': str(t[1]),
        'train_time': str(t[2]),
        'departing_station': t[3],
        'confirmation_code': t[4]
    } for t in (trains or [])]

    return jsonify({
        'flights': flights_data,
        'trains': trains_data
    })

# ==================== MATCHING ROUTES ====================


@app.route('/api/matches/flights', methods=['POST'])
def find_flight_matches():
    """Find rideshare matches for flights"""
    data = request.json
    departing_airport = data.get('departing_airport', '').upper()
    flight_date = data.get('flight_date')
    flight_time = data.get('flight_time')
    time_window = data.get('time_window', 2)

    if not all([departing_airport, flight_date, flight_time]):
        return jsonify({'error': 'Missing required fields'}), 400

    matches = db.find_matching_flights(
        departing_airport, flight_time, flight_date, time_window)

    matches_data = [{
        'case_id': m[0],
        'full_name': m[1],
        'flight_no': m[2],
        'flight_time': str(m[3]),
        'flight_date': str(m[4]),
        'departing_airport': m[5]
    } for m in matches]

    return jsonify({
        'matches': matches_data,
        'count': len(matches_data)
    })


@app.route('/api/matches/trains', methods=['POST'])
def find_train_matches():
    """Find rideshare matches for trains"""
    data = request.json
    train_date = data.get('train_date')
    departing_station = data.get('departing_station')

    if not all([train_date, departing_station]):
        return jsonify({'error': 'Missing required fields'}), 400

    matches = db.find_matching_trains(train_date, departing_station)

    matches_data = [{
        'case_id': m[0],
        'full_name': m[1],
        'train_no': m[2],
        'train_time': str(m[3]),
        'departing_station': m[4]
    } for m in matches]

    return jsonify({
        'matches': matches_data,
        'count': len(matches_data)
    })


@app.route('/api/matches/group/<int:group_id>', methods=['GET'])
def find_group_matches(group_id):
    """Find rideshare matches for a transport group"""
    search_info, matches = db.find_matches_for_group(group_id)

    if not search_info:
        return jsonify({'error': 'No flight information found for this group'}), 404

    # format search info
    member = search_info['member']
    flight = search_info['flight']

    search_data = {
        'member_case_id': member[0],
        'member_name': member[1],
        'flight_no': flight[0],
        'flight_date': str(flight[1]),
        'flight_time': str(flight[2]),
        'departing_airport': flight[3]
    }

    # format matches
    matches_data = [{
        'case_id': m[0],
        'full_name': m[1],
        'flight_no': m[2] if m[2] else 'GROUP MEMBER',
        'flight_time': str(m[3]) if m[3] else None,
        'flight_date': str(m[4]) if m[4] else None,
        'departing_airport': m[5] if m[5] else None
    } for m in matches]

    return jsonify({
        'search_info': search_data,
        'matches': matches_data,
        'count': len(matches_data)
    })

# ==================== GROUP ROUTES ====================


@app.route('/api/groups', methods=['GET'])
def get_groups():
    """Get all groups with member counts"""
    groups = db.view_all_groups()
    return jsonify([{
        'group_id': g[0],
        'group_name': g[1],
        'member_count': g[2]
    } for g in groups])


@app.route('/api/groups', methods=['POST'])
def create_group():
    """Create a new transport group"""
    data = request.json
    group_name = data.get('group_name')

    if not group_name:
        return jsonify({'error': 'Group name is required'}), 400

    group_id = db.create_group(group_name)
    if group_id:
        return jsonify({'message': 'Group created successfully', 'group_id': group_id}), 201
    return jsonify({'error': 'Failed to create group'}), 500


@app.route('/api/groups/<int:group_id>/members', methods=['GET'])
def get_group_members(group_id):
    """Get all members of a group"""
    members = db.get_group_members(group_id)
    return jsonify([{
        'case_id': m[0],
        'full_name': m[1],
        'year_of_study': m[2]
    } for m in members])


@app.route('/api/groups/join', methods=['POST'])
def join_group():
    """Student joins a group"""
    data = request.json
    case_id = data.get('case_id')
    group_id = data.get('group_id')

    if not all([case_id, group_id]):
        return jsonify({'error': 'Missing required fields'}), 400

    success = db.join_group(case_id, group_id)
    if success:
        return jsonify({'message': 'Joined group successfully'}), 200
    return jsonify({'error': 'Failed to join group'}), 500


@app.route('/api/groups/leave', methods=['POST'])
def leave_group():
    """Student leaves their group"""
    data = request.json
    case_id = data.get('case_id')

    if not case_id:
        return jsonify({'error': 'Case ID is required'}), 400

    success = db.leave_group(case_id)
    if success:
        return jsonify({'message': 'Left group successfully'}), 200
    return jsonify({'error': 'Failed to leave group'}), 500


@app.route('/api/groups/student/<case_id>', methods=['GET'])
def get_student_group(case_id):
    """Get the group a student belongs to"""
    group = db.get_student_group(case_id)
    if group:
        return jsonify({
            'group_id': group[0],
            'group_name': group[1]
        })
    return jsonify({'group': None})

# ==================== HEALTH CHECK ====================


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'API is running'})


if __name__ == '__main__':
    print("\n" + "="*60)
    print("  STUDENT RIDESHARE MATCHER - API SERVER")
    print("  API running at: http://localhost:5001")
    print("  Frontend should run at: http://localhost:5173")
    print("="*60 + "\n")
    app.run(debug=True, port=5001)
