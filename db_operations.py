from db_config import get_connection
from mysql.connector import Error

# function to add new student to database


def add_student(case_id, full_name, year_of_study):
    conn = get_connection()
    if not conn:
        return False

    try:
        cursor = conn.cursor()
        # Check if student already exists
        cursor.execute(
            "SELECT case_id FROM Student WHERE case_id = %s", (case_id,))
        if cursor.fetchone():
            print(f"Student with case_id '{case_id}' already exists!")
            cursor.close()
            conn.close()
            return False

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

# delete a student from database


def delete_student(case_id):
    conn = get_connection()
    if not conn:
        return False

    try:
        cursor = conn.cursor()
        # Check if student exists
        cursor.execute(
            "SELECT case_id FROM Student WHERE case_id = %s", (case_id,))
        if not cursor.fetchone():
            print(f"Student with case_id '{case_id}' not found!")
            cursor.close()
            conn.close()
            return False

        # Delete the student (cascades will handle bookings)
        query = "DELETE FROM Student WHERE case_id = %s"
        cursor.execute(query, (case_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Error as e:
        print(f"Error deleting student: {e}")
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
        cursor.execute(query, (flight_no, flight_date,
                       flight_time, departing_airport))
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
        cursor.execute(query, (train_no, train_date,
                       train_time, departing_station))
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
        cursor.execute(
            "SELECT case_id FROM Student WHERE case_id = %s", (case_id,))
        if not cursor.fetchone():
            print("Student not found!")
            cursor.close()
            conn.close()
            return False

        # check if flight exists
        cursor.execute(
            "SELECT flight_no FROM Flight WHERE flight_no = %s", (flight_no,))
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
        cursor.execute(
            "SELECT case_id FROM Student WHERE case_id = %s", (case_id,))
        if not cursor.fetchone():
            print("Student not found!")
            cursor.close()
            conn.close()
            return False

        # check train exists
        cursor.execute(
            "SELECT train_no FROM Train WHERE train_no = %s", (train_no,))
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
# includes group expansion - if matched student is in group, returns all group members


def find_matching_flights(departing_airport, flight_time, flight_date, time_window_hours=2):
    conn = get_connection()
    if not conn:
        return []

    try:
        cursor = conn.cursor()
        # first find students going to same destination airport within time window on same date
        query = """
        SELECT s.case_id, s.full_name, f.flight_no, f.flight_time, f.flight_date, f.departing_airport, s.group_id
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
        direct_matches = cursor.fetchall()

        # collect all unique group ids from matches
        group_ids = set()
        for match in direct_matches:
            group_id = match[6]  # group_id is at index 6
            if group_id is not None:
                group_ids.add(group_id)

        # get all members of matched groups
        all_results = []
        seen_case_ids = set()

        # add direct matches first
        for match in direct_matches:
            case_id = match[0]
            if case_id not in seen_case_ids:
                # exclude group_id from final result
                all_results.append(match[:6])
                seen_case_ids.add(case_id)

        # now add all other group members who arent already in results
        for group_id in group_ids:
            group_query = """
            SELECT s.case_id, s.full_name, 'GROUP MEMBER' as flight_no,
                   NULL as flight_time, NULL as flight_date, NULL as departing_airport
            FROM Student s
            WHERE s.group_id = %s
            """
            cursor.execute(group_query, (group_id,))
            group_members = cursor.fetchall()

            for member in group_members:
                case_id = member[0]
                if case_id not in seen_case_ids:
                    all_results.append(member)
                    seen_case_ids.add(case_id)

        cursor.close()
        conn.close()
        return all_results
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

# find rideshare matches for an entire group
def find_matches_for_group(group_id):
    """
    Find rideshare matches for a transport group
    Uses first group member's flight to search for matches
    """
    conn = get_connection()
    if not conn:
        return None, []

    try:
        cursor = conn.cursor()

        # get group members
        cursor.execute("""
            SELECT s.case_id, s.full_name
            FROM Student s
            WHERE s.group_id = %s
            ORDER BY s.full_name
        """, (group_id,))
        members = cursor.fetchall()

        if not members:
            cursor.close()
            conn.close()
            return None, []

        # find first member who has a flight registered
        search_member = None
        flight_info = None

        for member_id, member_name in members:
            cursor.execute("""
                SELECT f.flight_no, f.flight_date, f.flight_time, f.departing_airport
                FROM StudentFlight sf
                JOIN Flight f ON sf.flight_no = f.flight_no
                WHERE sf.case_id = %s
                ORDER BY f.flight_date, f.flight_time
                LIMIT 1
            """, (member_id,))

            result = cursor.fetchone()
            if result:
                search_member = (member_id, member_name)
                flight_info = result
                break

        if not flight_info:
            cursor.close()
            conn.close()
            return None, []

        # use this flight info to find matches
        flight_no, flight_date, flight_time, departing_airport = flight_info

        # use 2 hour default window for group searches
        # match with ANY students (individuals or other groups) EXCEPT your own group
        query = """
        SELECT s.case_id, s.full_name, f.flight_no, f.flight_time, f.flight_date, f.departing_airport, s.group_id
        FROM Student s
        JOIN StudentFlight sf ON s.case_id = sf.case_id
        JOIN Flight f ON sf.flight_no = f.flight_no
        WHERE f.departing_airport = %s
        AND f.flight_date = %s
        AND f.flight_time BETWEEN
            SUBTIME(%s, '2:00:00') AND ADDTIME(%s, '2:00:00')
        AND (s.group_id IS NULL OR s.group_id != %s)
        ORDER BY f.flight_time, s.full_name
        """

        cursor.execute(query, (departing_airport, flight_date, flight_time,
                              flight_time, group_id))
        direct_matches = cursor.fetchall()

        # collect group ids and expand - include all OTHER groups from matches
        group_ids = set()
        for match in direct_matches:
            gid = match[6]
            if gid is not None and gid != group_id:
                group_ids.add(gid)

        all_results = []
        seen_case_ids = set()

        # add direct matches
        for match in direct_matches:
            case_id = match[0]
            if case_id not in seen_case_ids:
                all_results.append(match[:6])
                seen_case_ids.add(case_id)

        # add other group members
        for gid in group_ids:
            cursor.execute("""
                SELECT s.case_id, s.full_name, 'GROUP MEMBER' as flight_no,
                       NULL as flight_time, NULL as flight_date, NULL as departing_airport
                FROM Student s
                WHERE s.group_id = %s
            """, (gid,))
            group_members = cursor.fetchall()

            for member in group_members:
                case_id = member[0]
                if case_id not in seen_case_ids:
                    all_results.append(member)
                    seen_case_ids.add(case_id)

        cursor.close()
        conn.close()

        # return search info and matches
        search_info = {
            'member': search_member,
            'flight': flight_info
        }

        return search_info, all_results

    except Error as e:
        print(f"Error finding group matches: {e}")
        if conn:
            conn.close()
        return None, []

# create a new transport group


def create_group(group_name):
    conn = get_connection()
    if not conn:
        return None

    try:
        cursor = conn.cursor()
        query = "INSERT INTO TransportGroup (group_name) VALUES (%s)"
        cursor.execute(query, (group_name,))
        conn.commit()
        group_id = cursor.lastrowid  # get the auto-generated ID
        cursor.close()
        conn.close()
        return group_id
    except Error as e:
        print(f"Error creating group: {e}")
        if conn:
            conn.close()
        return None

# join a transport group


def join_group(case_id, group_id):
    conn = get_connection()
    if not conn:
        return False

    try:
        cursor = conn.cursor()
        # check if group exists
        cursor.execute(
            "SELECT group_id FROM TransportGroup WHERE group_id = %s", (group_id,))
        if not cursor.fetchone():
            print("Group not found!")
            cursor.close()
            conn.close()
            return False

        # update student's group_id
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

# leave transport group


def leave_group(case_id):
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

# get all members of a group


def get_group_members(group_id):
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

# get student's group info


def get_student_group(case_id):
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

# view all available groups


def view_all_groups():
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
