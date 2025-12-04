import db_operations as db
from db_config import test_connection

# print the menu


def show_menu():
    print("\n" + "="*60)
    print("     STUDENT RIDESHARE MATCHER")
    print("     Find students to split Uber/Lyft costs")
    print("="*60)
    print("1.  Add Student")
    print("2.  View All Students")
    print("3.  Add Flight")
    print("4.  View All Flights")
    print("5.  Add Train")
    print("6.  View All Trains")
    print("7.  Register Student's Flight Timings & Location")
    print("8.  Register Student's Train Timings & Location")
    print("9.  View Student's Travel Plans")
    print("10. Find Rideshare Matches (Flights)")
    print("11. Find Rideshare Matches (Trains)")
    print("12. Create Transport Group")
    print("13. Join Transport Group")
    print("14. Leave Group")
    print("15. View My Group Members")
    print("16. View All Groups")
    print("17. Exit")
    print("="*60)

# handl adding studnet


def handle_add_student():
    print("\n--- Add New Student ---")
    case_id = input("Enter Case ID: ").strip()
    if not case_id:
        print("Case ID cannot be empty!")
        return

    full_name = input("Enter Full Name: ").strip()
    if not full_name:
        print("Name cannot be empty!")
        return

    try:
        year_of_study = int(input("Enter Year of Study (1-4): "))
        if year_of_study < 1 or year_of_study > 4:
            print("Year must be between 1 and 4!")
            return
    except ValueError:
        print("Please enter a valid number!")
        return

    if db.add_student(case_id, full_name, year_of_study):
        print(f"Student {full_name} added succesfully!")
    else:
        print("Failed to add student")

# show all studnets in table format


def handle_view_students():
    print("\n--- All Students ---")
    students = db.view_all_students()

    if not students:
        print("No students found")
        return

    # print header
    print(f"{'Case ID':<15} {'Full Name':<30} {'Year':<8} {'Group ID':<10}")
    print("-" * 70)

    # print each studnet
    for student in students:
        case_id, name, year, group_id = student
        group_str = str(group_id) if group_id else "N/A"
        print(f"{case_id:<15} {name:<30} {year:<8} {group_str:<10}")

    print(f"\nTotal: {len(students)} student(s)")

# add new flight


def handle_add_flight():
    print("\n--- Add New Flight ---")

    # get date in format YYYY-MM-DD
    flight_date = input("Enter Flight Date (YYYY-MM-DD): ").strip()
    if not flight_date:
        print("Date cannot be empty!")
        return

    # get time in HH:MM:SS format
    flight_time = input("Enter Flight Time (HH:MM:SS): ").strip()
    if not flight_time:
        print("Time cannot be empty!")
        return

    departing_airport = input(
        "Enter Departing Airport (e.g., CLE, ORD): ").strip().upper()
    if not departing_airport:
        print("Airport code cannot be empty!")
        return

    # auto-generate flight number from date/time/airport
    # format: AIRPORT_YYYYMMDD_HHMM
    date_part = flight_date.replace("-", "")
    time_part = flight_time.replace(":", "")[:4]  # just HHMM
    flight_no = f"{departing_airport}_{date_part}_{time_part}"

    if db.add_flight(flight_no, flight_date, flight_time, departing_airport):
        print(f"Flight added successfully!")
        print(f"Flight ID: {flight_no}")
    else:
        print("Failed to add flight (might already exist)")

# show all flights


def handle_view_flights():
    print("\n--- All Flights ---")
    flights = db.view_all_flights()

    if not flights:
        print("No flights found")
        return

    # header
    print(f"{'Flight ID':<25} {'Date':<15} {'Time':<12} {'Airport':<10}")
    print("-" * 70)

    # show flights
    for flight in flights:
        flight_no, date, time, airport = flight
        print(f"{flight_no:<25} {str(date):<15} {str(time):<12} {airport:<10}")

    print(f"\nTotal: {len(flights)} flight(s)")

# add train


def handle_add_train():
    print("\n--- Add New Train ---")

    train_date = input("Enter Train Date (YYYY-MM-DD): ").strip()
    if not train_date:
        print("Date cannot be empty!")
        return

    train_time = input("Enter Train Time (HH:MM:SS): ").strip()
    if not train_time:
        print("Time cannot be empty!")
        return

    departing_station = input("Enter Departing Station: ").strip()
    if not departing_station:
        print("Station cannot be empty!")
        return

    # auto-generate train number from date/time/station
    # format: STATION_YYYYMMDD_HHMM (use first 3 chars of station)
    date_part = train_date.replace("-", "")
    time_part = train_time.replace(":", "")[:4]
    station_code = departing_station.replace(" ", "")[:3].upper()
    train_no = f"{station_code}_{date_part}_{time_part}"

    if db.add_train(train_no, train_date, train_time, departing_station):
        print(f"Train added successfully!")
        print(f"Train ID: {train_no}")
    else:
        print("Failed to add train (might already exist)")

# show all trains


def handle_view_trains():
    print("\n--- All Trains ---")
    trains = db.view_all_trains()

    if not trains:
        print("No trains found")
        return

    print(f"{'Train ID':<25} {'Date':<15} {'Time':<12} {'Station':<20}")
    print("-" * 75)

    for train in trains:
        train_no, date, time, station = train
        print(f"{train_no:<25} {str(date):<15} {str(time):<12} {station:<20}")

    print(f"\nTotal: {len(trains)} train(s)")

# register student on flight for rideshare matching


def handle_book_flight():
    print("\n--- Register Student's Flight ---")
    print("Add student to a flight to find rideshare matches\n")
    print("TIP: View flights first (option 4) to get the Flight ID\n")

    case_id = input("Enter Student Case ID: ").strip()
    flight_no = input("Enter Flight ID: ").strip()
    confirmation_code = input("Enter Airline Confirmation Code: ").strip()

    if not case_id or not flight_no or not confirmation_code:
        print("All fields are required!")
        return

    if db.book_student_flight(confirmation_code, case_id, flight_no):
        print(f"Student {case_id} registered on flight {flight_no}")
        print("Use option 10 to find rideshare matches!")
    else:
        print("Failed to register flight")

# register student on train for rideshare matching


def handle_book_train():
    print("\n--- Register Student's Train ---")
    print("Add student to a train to find rideshare matches\n")
    print("TIP: View trains first (option 6) to get the Train ID\n")

    case_id = input("Enter Student Case ID: ").strip()
    train_no = input("Enter Train ID: ").strip()
    confirmation_code = input("Enter Train Confirmation Code: ").strip()

    if not case_id or not train_no or not confirmation_code:
        print("All fields are required!")
        return

    if db.book_student_train(confirmation_code, case_id, train_no):
        print(f"Student {case_id} registered on train {train_no}")
        print("Use option 11 to find rideshare matches!")
    else:
        print("Failed to register train")

# view all travel plans for a student


def handle_student_bookings():
    print("\n--- Student Travel Plans ---")
    case_id = input("Enter Student Case ID: ").strip()
    if not case_id:
        print("Case ID cannot be empty!")
        return

    flights, trains = db.get_student_bookings(case_id)

    if flights is None and trains is None:
        print("Error retrieving travel plans")
        return

    print(f"\n** Travel Plans for Student: {case_id} **\n")

    # show flights
    if flights:
        print("FLIGHTS:")
        print(
            f"{'Flight ID':<25} {'Date':<15} {'Time':<12} {'Airport':<10} {'Confirmation':<15}")
        print("-" * 80)
        for flight in flights:
            fno, fdate, ftime, fairport, fconf = flight
            print(
                f"{fno:<25} {str(fdate):<15} {str(ftime):<12} {fairport:<10} {fconf:<15}")
    else:
        print("FLIGHTS: None")

    print()

    # show trains
    if trains:
        print("TRAINS:")
        print(
            f"{'Train ID':<25} {'Date':<15} {'Time':<12} {'Station':<20} {'Confirmation':<15}")
        print("-" * 90)
        for train in trains:
            tno, tdate, ttime, tstation, tconf = train
            print(
                f"{tno:<25} {str(tdate):<15} {str(ttime):<12} {tstation:<20} {tconf:<15}")
    else:
        print("TRAINS: None")

# find students going to same destination with flexible time


def handle_find_flight_matches():
    print("\n--- Find Flight Rideshare Matches ---")
    print("Find students going to same destination to split Uber/Lyft costs\n")

    departing_airport = input(
        "Enter Destination Airport (e.g., CLE, ORD): ").strip().upper()
    if not departing_airport:
        print("Airport is required!")
        return

    flight_date = input("Enter Your Flight Date (YYYY-MM-DD): ").strip()
    if not flight_date:
        print("Date is required!")
        return

    flight_time = input("Enter Your Flight Time (HH:MM:SS): ").strip()
    if not flight_time:
        print("Time is required!")
        return

    # ask for time flexibility
    print("\nHow flexible are you with timing?")
    print("1. Within 1 hour of my flight")
    print("2. Within 2 hours of my flight")
    print("3. Within 3 hours of my flight")
    print("4. Anytime on same day")

    choice = input("Enter choice (1-4): ").strip()

    time_window_map = {'1': 1, '2': 2, '3': 3, '4': 12}
    time_window = time_window_map.get(choice, 2)  # default 2 hours

    matches = db.find_matching_flights(
        departing_airport, flight_time, flight_date, time_window)

    if not matches:
        print(
            f"No matches found going to {departing_airport} on {flight_date}")
        return

    print(f"\n** Students going to {departing_airport} on {flight_date} **")
    print(f"(within {time_window} hour(s) of {flight_time})")
    print("Connect with these students to share rideshare costs!\n")
    print(f"{'Case ID':<15} {'Name':<30} {'Flight Time':<12} {'Flight ID':<25}")
    print("-" * 85)

    for match in matches:
        case_id, name, flight_no, ftime, fdate, airport = match
        print(f"{case_id:<15} {name:<30} {str(ftime):<12} {flight_no:<25}")

    print(f"\nTotal: {len(matches)} student(s) - potential rideshare group!")

# find students on same train for ridesharing


def handle_find_train_matches():
    print("\n--- Find Train Rideshare Matches ---")
    print("Find students on the same train to split ride costs\n")

    train_date = input("Enter Train Date (YYYY-MM-DD): ").strip()
    departing_station = input("Enter Departing Station: ").strip()

    if not train_date or not departing_station:
        print("Both fields are required!")
        return

    matches = db.find_matching_trains(train_date, departing_station)

    if not matches:
        print("No matches found for this date/station")
        return

    print(
        f"\n** Students traveling from {departing_station} on {train_date} **")
    print("Connect with these students to share rideshare costs!\n")
    print(f"{'Case ID':<15} {'Name':<30} {'Train ID':<25} {'Time':<12}")
    print("-" * 85)

    for match in matches:
        case_id, name, train_no, ttime, station = match
        print(f"{case_id:<15} {name:<30} {train_no:<25} {str(ttime):<12}")

    print(f"\nTotal: {len(matches)} student(s) - potential rideshare group!")

# create new transport group
def handle_create_group():
    print("\n--- Create Transport Group ---")
    print("Groups allow friends/roommates to coordinate travel together\n")

    group_name = input("Enter Group Name: ").strip()
    if not group_name:
        print("Group name cannot be empty!")
        return

    group_id = db.create_group(group_name)
    if group_id:
        print(f"\nGroup created successfully!")
        print(f"Group ID: {group_id}")
        print(f"Group Name: {group_name}")
        print("\nShare this Group ID with your friends so they can join!")
    else:
        print("Failed to create group")

# join existing transport group
def handle_join_group():
    print("\n--- Join Transport Group ---")
    print("Enter your Case ID and the Group ID to join\n")

    case_id = input("Enter Your Case ID: ").strip()
    if not case_id:
        print("Case ID cannot be empty!")
        return

    try:
        group_id = int(input("Enter Group ID to Join: ").strip())
    except ValueError:
        print("Please enter a valid group ID number!")
        return

    if db.join_group(case_id, group_id):
        print(f"\nSuccessfully joined group {group_id}!")
        print("You and your group members will be matched together for ridesharing")
    else:
        print("Failed to join group")

# leave current group
def handle_leave_group():
    print("\n--- Leave Group ---")

    case_id = input("Enter Your Case ID: ").strip()
    if not case_id:
        print("Case ID cannot be empty!")
        return

    # check if student is in a group first
    group_info = db.get_student_group(case_id)
    if not group_info:
        print("You are not currently in any group")
        return

    group_id, group_name = group_info
    print(f"\nYou are currently in: {group_name} (ID: {group_id})")

    confirm = input("Are you sure you want to leave? (yes/no): ").strip().lower()
    if confirm != 'yes':
        print("Cancelled")
        return

    if db.leave_group(case_id):
        print(f"\nYou have left the group '{group_name}'")
    else:
        print("Failed to leave group")

# view members in your group
def handle_view_my_group():
    print("\n--- My Group Members ---")

    case_id = input("Enter Your Case ID: ").strip()
    if not case_id:
        print("Case ID cannot be empty!")
        return

    group_info = db.get_student_group(case_id)
    if not group_info:
        print("You are not currently in any group")
        return

    group_id, group_name = group_info
    print(f"\n** Group: {group_name} (ID: {group_id}) **\n")

    members = db.get_group_members(group_id)
    if not members:
        print("No members found in this group")
        return

    print(f"{'Case ID':<15} {'Full Name':<30} {'Year':<8}")
    print("-" * 55)

    for member in members:
        case_id, name, year = member
        print(f"{case_id:<15} {name:<30} {year:<8}")

    print(f"\nTotal: {len(members)} member(s) in your group")

# view all available groups
def handle_view_all_groups():
    print("\n--- All Transport Groups ---")
    groups = db.view_all_groups()

    if not groups:
        print("No groups found")
        return

    print(f"{'Group ID':<12} {'Group Name':<30} {'Members':<10}")
    print("-" * 55)

    for group in groups:
        group_id, group_name, member_count = group
        print(f"{group_id:<12} {group_name:<30} {member_count:<10}")

    print(f"\nTotal: {len(groups)} group(s)")
    print("\nUse option 13 to join a group by its Group ID")

# main program loop


def main():
    print("\nStarting Student Rideshare Matcher ")

    # test db connection first
    if not test_connection():
        print("\nPlease check your database credentials in db_config.py")
        return

    # main loop
    while True:
        show_menu()

        try:
            choice = input("\nEnter your choice (1-17): ").strip()

            if choice == '1':
                handle_add_student()
            elif choice == '2':
                handle_view_students()
            elif choice == '3':
                handle_add_flight()
            elif choice == '4':
                handle_view_flights()
            elif choice == '5':
                handle_add_train()
            elif choice == '6':
                handle_view_trains()
            elif choice == '7':
                handle_book_flight()
            elif choice == '8':
                handle_book_train()
            elif choice == '9':
                handle_student_bookings()
            elif choice == '10':
                handle_find_flight_matches()
            elif choice == '11':
                handle_find_train_matches()
            elif choice == '12':
                handle_create_group()
            elif choice == '13':
                handle_join_group()
            elif choice == '14':
                handle_leave_group()
            elif choice == '15':
                handle_view_my_group()
            elif choice == '16':
                handle_view_all_groups()
            elif choice == '17':
                print("\n Exiting travel match system!")
                break
            else:
                print("Invalid choice! Please enter a number between 1 and 17")

            # wait for user before showing menu again
            input("\nPress Enter to continue ")

        except KeyboardInterrupt:
            print("\n\nExiting Student Rideshare Matcher. Goodbye!")
            break
        except Exception as e:
            print(f"\nAn error occurred: {e}")
            input("\nPress Enter to continue ")


if __name__ == "__main__":
    main()
