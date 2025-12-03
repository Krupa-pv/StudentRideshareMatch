-- Database setup for Student Rideshare Matcher
-- Creates all necessary tables for matching students on flights/trains

CREATE DATABASE IF NOT EXISTS travel_match;
USE travel_match;

-- TransportGroup table - for grouping students
CREATE TABLE IF NOT EXISTS TransportGroup (
    group_id INT AUTO_INCREMENT,
    group_name VARCHAR(100),
    PRIMARY KEY (group_id)
);

-- Flight table - stores flight information
CREATE TABLE IF NOT EXISTS Flight (
    flight_no VARCHAR(20),
    flight_date DATE NOT NULL,
    flight_time TIME NOT NULL,
    departing_airport VARCHAR(100) NOT NULL,
    PRIMARY KEY (flight_no)
);

-- Train table - stores train information
CREATE TABLE IF NOT EXISTS Train (
    train_no VARCHAR(20),
    train_date DATE NOT NULL,
    train_time TIME NOT NULL,
    departing_station VARCHAR(100) NOT NULL,
    PRIMARY KEY (train_no)
);

-- Student table - stores student information
CREATE TABLE IF NOT EXISTS Student (
    case_id VARCHAR(50),
    full_name VARCHAR(100) NOT NULL,
    year_of_study INT,
    group_id INT NULL,
    PRIMARY KEY (case_id),
    FOREIGN KEY (group_id) REFERENCES TransportGroup(group_id) ON DELETE SET NULL
);

-- StudentFlight junction table - links students to flights
CREATE TABLE IF NOT EXISTS StudentFlight (
    flight_confirmation_code VARCHAR(50),
    case_id VARCHAR(50) NOT NULL,
    flight_no VARCHAR(20) NOT NULL,
    PRIMARY KEY (flight_confirmation_code),
    FOREIGN KEY (case_id) REFERENCES Student(case_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_no) REFERENCES Flight(flight_no) ON DELETE CASCADE
);

-- StudentTrain junction table - links students to trains
CREATE TABLE IF NOT EXISTS StudentTrain (
    train_confirmation_code VARCHAR(50),
    case_id VARCHAR(50) NOT NULL,
    train_no VARCHAR(20) NOT NULL,
    PRIMARY KEY (train_confirmation_code),
    FOREIGN KEY (case_id) REFERENCES Student(case_id) ON DELETE CASCADE,
    FOREIGN KEY (train_no) REFERENCES Train(train_no) ON DELETE CASCADE
);

SELECT 'Database setup complete!' AS Status;
