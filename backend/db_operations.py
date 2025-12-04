from db_config import get_connection
from mysql.connector import Error

# function to add new student to database
def add_student(case_id, full_name, year_of_study):
    conn = get_connection()
    if not conn:
        return False

    try:
        cursor = conn.cursor()
        query = "INSERT INTO Student (case_id, full_name, year_of_study) VALUES (%s, %s, %s)"
        cursor.execute(query, (case_id, full_name, year_of_study))
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Error as e:
        print(f"Error adding student: {e}")
        if conn:
            conn.close()
        return False

# get all students from db
def view_all_students():
    conn = get_connection()
    if not conn:
        return []

    try:
        cursor = conn.cursor()
        query = "SELECT case_id, full_name, year_of_study, group_id FROM Student ORDER BY full_name"
        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return results
    except Error as e:
        print(f"Error fetching students: {e}")
        if conn:
            conn.close()
        return []

# add new flight to system
def add_flight(flight_no, flight_date, flight_time, departing_airport):
    conn = get_connection()
    if not conn:
        return False

    try:
        cursor = conn.cursor()
        query = "INSERT INTO Flight (flight_no, flight_date, flight_time, departing_airport) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (flight_no, flight_date, flight_time, departing_airport))
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Error as e:
        print(f"Error adding flight: {e}")
        if conn:
            conn.close()
        return False

# show all flights
def view_all_flights():
    conn = get_connection()
    if not conn:
        return []

    try:
        cursor = conn.cursor()
        query = "SELECT flight_no, flight_date, flight_time, departing_airport FROM Flight ORDER BY flight_date, flight_time"
        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return results
    except Error as e:
        print(f"Error getting flights: {e}")
        if conn:
            conn.close()
        return []

# add train to database
def add_train(train_no, train_date, train_time, departing_station):
    conn = get_connection()
    if not conn:
        return False

    try:
        cursor = conn.cursor()
        query = "INSERT INTO Train (train_no, train_date, train_time, departing_station) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (train_no, train_date, train_time, departing_station))
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Error as e:
        print(f"Error adding train: {e}")
        if conn:
            conn.close()
        return False

# view all trains
def view_all_trains():
    conn = get_connection()
    if not conn:
        return []

    try:
        cursor = conn.cursor()
        query = "SELECT train_no, train_date, train_time, departing_station FROM Train ORDER BY train_date, train_time"
        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return results
    except Error as e:
        print(f"Error fetching trains: {e}")
        if conn:
            conn.close()
        return []

# book student on a flight - needs confirmation code
def book_student_flight(confirmation_code, case_id, flight_no):
    conn = get_connection()
    if not conn:
        return False

    try:
        cursor = conn.cursor()
        # first check if student exists
        cursor.execute("SELECT case_id FROM Student WHERE case_id = %s", (case_id,))
        if not cursor.fetchone():
            print("Student not found!")
            cursor.close()
            conn.close()
            return False

        # check if flight exists
        cursor.execute("SELECT flight_no FROM Flight WHERE flight_no = %s", (flight_no,))
        if not cursor.fetchone():
            print("Flight not found!")
            cursor.close()
            conn.close()
            return False

        # now book the flight
        query = "INSERT INTO StudentFlight (flight_confirmation_code, case_id, flight_no) VALUES (%s, %s, %s)"
        cursor.execute(query, (confirmation_code, case_id, flight_no))
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Error as e:
        print(f"Error booking flight: {e}")
        if conn:
            conn.close()
        return False

# book student on train
def book_student_train(confirmation_code, case_id, train_no):
    conn = get_connection()
    if not conn:
        return False

    try:
        cursor = conn.cursor()
        # check student exists
        cursor.execute("SELECT case_id FROM Student WHERE case_id = %s", (case_id,))
        if not cursor.fetchone():
            print("Student not found!")
            cursor.close()
            conn.close()
            return False

        # check train exists
        cursor.execute("SELECT train_no FROM Train WHERE train_no = %s", (train_no,))
        if not cursor.fetchone():
            print("Train not found!")
            cursor.close()
            conn.close()
            return False

        # book it
        query = "INSERT INTO StudentTrain (train_confirmation_code, case_id, train_no) VALUES (%s, %s, %s)"
        cursor.execute(query, (confirmation_code, case_id, train_no))
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Error as e:
        print(f"Error booking train: {e}")
        if conn:
            conn.close()
        return False

# get all bookings for a student (both flights and trains)
def get_student_bookings(case_id):
    conn = get_connection()
    if not conn:
        return None, None

    try:
        cursor = conn.cursor()

        # get flights
        flight_query = """
        SELECT f.flight_no, f.flight_date, f.flight_time, f.departing_airport, sf.flight_confirmation_code
        FROM StudentFlight sf
        JOIN Flight f ON sf.flight_no = f.flight_no
        WHERE sf.case_id = %s
        ORDER BY f.flight_date, f.flight_time
        """
        cursor.execute(flight_query, (case_id,))
        flights = cursor.fetchall()

        # get trains
        train_query = """
        SELECT t.train_no, t.train_date, t.train_time, t.departing_station, st.train_confirmation_code
        FROM StudentTrain st
        JOIN Train t ON st.train_no = t.train_no
        WHERE st.case_id = %s
        ORDER BY t.train_date, t.train_time
        """
        cursor.execute(train_query, (case_id,))
        trains = cursor.fetchall()

        cursor.close()
        conn.close()
        return flights, trains
    except Error as e:
        print(f"Error getting bookings: {e}")
        if conn:
            conn.close()
        return None, None

# find students going to same destination with flexible time matching
def find_matching_flights(departing_airport, flight_time, flight_date, time_window_hours=2):
    conn = get_connection()
    if not conn:
        return []

    try:
        cursor = conn.cursor()
        # find students going to same destination airport within time window on same date
        query = """
        SELECT s.case_id, s.full_name, f.flight_no, f.flight_time, f.flight_date, f.departing_airport
        FROM Student s
        JOIN StudentFlight sf ON s.case_id = sf.case_id
        JOIN Flight f ON sf.flight_no = f.flight_no
        WHERE f.departing_airport = %s
        AND f.flight_date = %s
        AND f.flight_time BETWEEN
            SUBTIME(%s, %s) AND ADDTIME(%s, %s)
        ORDER BY f.flight_time, s.full_name
        """
        time_window = f"{time_window_hours}:00:00"
        cursor.execute(query, (departing_airport, flight_date, flight_time, time_window,
                              flight_time, time_window))
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return results
    except Error as e:
        print(f"Error finding matches: {e}")
        if conn:
            conn.close()
        return []

# find students on same train - for rideshare matching
def find_matching_trains(train_date, departing_station):
    conn = get_connection()
    if not conn:
        return []

    try:
        cursor = conn.cursor()
        query = """
        SELECT s.case_id, s.full_name, t.train_no, t.train_time, t.departing_station
        FROM Student s
        JOIN StudentTrain st ON s.case_id = st.case_id
        JOIN Train t ON st.train_no = t.train_no
        WHERE t.train_date = %s AND t.departing_station = %s
        ORDER BY t.train_time, s.full_name
        """
        cursor.execute(query, (train_date, departing_station))
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return results
    except Error as e:
        print(f"Error finding train matches: {e}")
        if conn:
            conn.close()
        return []

# ==================== GROUP OPERATIONS ====================

def create_group(group_name):
    """Create a new transport group"""
    conn = get_connection()
    if not conn:
        return None

    try:
        cursor = conn.cursor()
        query = "INSERT INTO TransportGroup (group_name) VALUES (%s)"
        cursor.execute(query, (group_name,))
        conn.commit()
        group_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return group_id
    except Error as e:
        print(f"Error creating group: {e}")
        if conn:
            conn.close()
        return None

def join_group(case_id, group_id):
    """Student joins a transport group"""
    conn = get_connection()
    if not conn:
        return False

    try:
        cursor = conn.cursor()
        # Check if group exists
        cursor.execute("SELECT group_id FROM TransportGroup WHERE group_id = %s", (group_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return False

        # Update student's group_id
        query = "UPDATE Student SET group_id = %s WHERE case_id = %s"
        cursor.execute(query, (group_id, case_id))
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Error as e:
        print(f"Error joining group: {e}")
        if conn:
            conn.close()
        return False

def leave_group(case_id):
    """Student leaves their transport group"""
    conn = get_connection()
    if not conn:
        return False

    try:
        cursor = conn.cursor()
        query = "UPDATE Student SET group_id = NULL WHERE case_id = %s"
        cursor.execute(query, (case_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Error as e:
        print(f"Error leaving group: {e}")
        if conn:
            conn.close()
        return False

def get_group_members(group_id):
    """Get all members of a group"""
    conn = get_connection()
    if not conn:
        return []

    try:
        cursor = conn.cursor()
        query = """
        SELECT s.case_id, s.full_name, s.year_of_study
        FROM Student s
        WHERE s.group_id = %s
        ORDER BY s.full_name
        """
        cursor.execute(query, (group_id,))
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return results
    except Error as e:
        print(f"Error getting group members: {e}")
        if conn:
            conn.close()
        return []

def get_student_group(case_id):
    """Get student's group info"""
    conn = get_connection()
    if not conn:
        return None

    try:
        cursor = conn.cursor()
        query = """
        SELECT tg.group_id, tg.group_name
        FROM Student s
        JOIN TransportGroup tg ON s.group_id = tg.group_id
        WHERE s.case_id = %s
        """
        cursor.execute(query, (case_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result
    except Error as e:
        print(f"Error getting student group: {e}")
        if conn:
            conn.close()
        return None

def view_all_groups():
    """View all available groups with member counts"""
    conn = get_connection()
    if not conn:
        return []

    try:
        cursor = conn.cursor()
        query = """
        SELECT tg.group_id, tg.group_name, COUNT(s.case_id) as member_count
        FROM TransportGroup tg
        LEFT JOIN Student s ON tg.group_id = s.group_id
        GROUP BY tg.group_id, tg.group_name
        ORDER BY tg.group_name
        """
        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()
        conn.close()
        return results
    except Error as e:
        print(f"Error getting groups: {e}")
        if conn:
            conn.close()
        return []
