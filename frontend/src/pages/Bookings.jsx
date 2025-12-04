import { useState, useEffect } from 'react';
import { api } from '../services/api';

function Bookings() {
    const [activeTab, setActiveTab] = useState('add-flight'); // 'add-flight', 'register-flight', 'add-train', 'register-train', 'my-bookings'
    const [flights, setFlights] = useState([]);
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(false);

    // Forms
    const [addFlightForm, setAddFlightForm] = useState({
        flight_date: '',
        flight_time: '',
        departing_airport: ''
    });

    const [registerFlightForm, setRegisterFlightForm] = useState({
        case_id: '',
        flight_no: '',
        confirmation_code: ''
    });

    const [addTrainForm, setAddTrainForm] = useState({
        train_date: '',
        train_time: '',
        departing_station: ''
    });

    const [registerTrainForm, setRegisterTrainForm] = useState({
        case_id: '',
        train_no: '',
        confirmation_code: ''
    });

    const [myBookingsCaseId, setMyBookingsCaseId] = useState('');
    const [myBookings, setMyBookings] = useState(null);

    useEffect(() => {
        loadFlights();
        loadTrains();
    }, []);

    const loadFlights = async () => {
        try {
            const response = await api.getFlights();
            setFlights(response.data || []);
        } catch (error) {
            console.error('Error loading flights:', error);
        }
    };

    const loadTrains = async () => {
        try {
            const response = await api.getTrains();
            setTrains(response.data || []);
        } catch (error) {
            console.error('Error loading trains:', error);
        }
    };

    const handleAddFlight = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.addFlight(addFlightForm);
            alert('Flight added successfully!');
            setAddFlightForm({ flight_date: '', flight_time: '', departing_airport: '' });
            loadFlights();
        } catch (error) {
            console.error('Error adding flight:', error);
            const errorMessage = error.response?.data?.error || 'Failed to add flight';
            alert(errorMessage);
        }
        setLoading(false);
    };

    const handleRegisterFlight = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.bookFlight(registerFlightForm);
            alert('Flight booking registered successfully!');
            setRegisterFlightForm({ case_id: '', flight_no: '', confirmation_code: '' });
        } catch (error) {
            console.error('Error registering flight:', error);
            const errorMessage = error.response?.data?.error || 'Failed to register flight';
            alert(errorMessage);
        }
        setLoading(false);
    };

    const handleAddTrain = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.addTrain(addTrainForm);
            alert('Train added successfully!');
            setAddTrainForm({ train_date: '', train_time: '', departing_station: '' });
            loadTrains();
        } catch (error) {
            console.error('Error adding train:', error);
            const errorMessage = error.response?.data?.error || 'Failed to add train';
            alert(errorMessage);
        }
        setLoading(false);
    };

    const handleRegisterTrain = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.bookTrain(registerTrainForm);
            alert('Train booking registered successfully!');
            setRegisterTrainForm({ case_id: '', train_no: '', confirmation_code: '' });
        } catch (error) {
            console.error('Error registering train:', error);
            const errorMessage = error.response?.data?.error || 'Failed to register train';
            alert(errorMessage);
        }
        setLoading(false);
    };

    const handleViewMyBookings = async (e) => {
        e.preventDefault();
        if (!myBookingsCaseId) {
            alert('Please enter a Case ID');
            return;
        }
        setLoading(true);
        try {
            const response = await api.getStudentBookings(myBookingsCaseId);
            setMyBookings(response.data);
        } catch (error) {
            console.error('Error loading bookings:', error);
            alert('Failed to load bookings');
            setMyBookings(null);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">Manage Travel Bookings</h2>
            <p className="text-center text-gray-600 mb-8">
                Add flights/trains to the system and register your bookings
            </p>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                <button
                    onClick={() => setActiveTab('add-flight')}
                    className={`px-4 py-2 border-2 border-black font-medium transition-colors ${activeTab === 'add-flight' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                        }`}
                >
                    Add Flight
                </button>
                <button
                    onClick={() => setActiveTab('register-flight')}
                    className={`px-4 py-2 border-2 border-black font-medium transition-colors ${activeTab === 'register-flight' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                        }`}
                >
                    Register Flight
                </button>
                <button
                    onClick={() => setActiveTab('add-train')}
                    className={`px-4 py-2 border-2 border-black font-medium transition-colors ${activeTab === 'add-train' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                        }`}
                >
                    Add Train
                </button>
                <button
                    onClick={() => setActiveTab('register-train')}
                    className={`px-4 py-2 border-2 border-black font-medium transition-colors ${activeTab === 'register-train' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                        }`}
                >
                    Register Train
                </button>
                <button
                    onClick={() => setActiveTab('my-bookings')}
                    className={`px-4 py-2 border-2 border-black font-medium transition-colors ${activeTab === 'my-bookings' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
                        }`}
                >
                    My Bookings
                </button>
            </div>

            {/* Add Flight Form */}
            {activeTab === 'add-flight' && (
                <div className="border-2 border-black p-6">
                    <h3 className="text-xl font-bold mb-4">Add Flight to System</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Add a flight that students can register for. The flight number will be auto-generated.
                    </p>
                    <form onSubmit={handleAddFlight}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Flight Date</label>
                                <input
                                    type="date"
                                    value={addFlightForm.flight_date}
                                    onChange={(e) => setAddFlightForm({ ...addFlightForm, flight_date: e.target.value })}
                                    required
                                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Flight Time</label>
                                <input
                                    type="time"
                                    value={addFlightForm.flight_time}
                                    onChange={(e) => setAddFlightForm({ ...addFlightForm, flight_time: e.target.value })}
                                    required
                                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Departing Airport</label>
                                <input
                                    type="text"
                                    value={addFlightForm.departing_airport}
                                    onChange={(e) => setAddFlightForm({ ...addFlightForm, departing_airport: e.target.value.toUpperCase() })}
                                    required
                                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black uppercase"
                                    placeholder="e.g., CLE, JFK"
                                    maxLength="3"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full border-2 border-black px-6 py-3 bg-black text-white hover:bg-white hover:text-black transition-colors font-medium disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Flight'}
                        </button>
                    </form>

                    {flights.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-bold mb-2">Available Flights ({flights.length})</h4>
                            <div className="border border-gray-300 max-h-60 overflow-y-auto">
                                {flights.map((flight, idx) => (
                                    <div key={idx} className="p-2 border-b border-gray-200 text-sm">
                                        <span className="font-medium">{flight.flight_no}</span> - {flight.departing_airport} on {flight.flight_date} at {flight.flight_time}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Register Flight Form */}
            {activeTab === 'register-flight' && (
                <div className="border-2 border-black p-6">
                    <h3 className="text-xl font-bold mb-4">Register Your Flight Booking</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Register yourself on a flight so others can find you for rideshare matching.
                    </p>
                    <form onSubmit={handleRegisterFlight}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Your Case ID</label>
                                <input
                                    type="text"
                                    value={registerFlightForm.case_id}
                                    onChange={(e) => setRegisterFlightForm({ ...registerFlightForm, case_id: e.target.value })}
                                    required
                                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="e.g., wxs428"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Flight Number</label>
                                <input
                                    type="text"
                                    value={registerFlightForm.flight_no}
                                    onChange={(e) => setRegisterFlightForm({ ...registerFlightForm, flight_no: e.target.value })}
                                    required
                                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="e.g., CLE_20241215_1400"
                                />
                                <p className="text-xs text-gray-600 mt-1">Find flight numbers in "Add Flight" tab</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Confirmation Code</label>
                                <input
                                    type="text"
                                    value={registerFlightForm.confirmation_code}
                                    onChange={(e) => setRegisterFlightForm({ ...registerFlightForm, confirmation_code: e.target.value.toUpperCase() })}
                                    required
                                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black uppercase"
                                    placeholder="e.g., ABC123"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full border-2 border-black px-6 py-3 bg-black text-white hover:bg-white hover:text-black transition-colors font-medium disabled:opacity-50"
                        >
                            {loading ? 'Registering...' : 'Register Flight'}
                        </button>
                    </form>
                </div>
            )}

            {/* Add Train Form */}
            {activeTab === 'add-train' && (
                <div className="border-2 border-black p-6">
                    <h3 className="text-xl font-bold mb-4">Add Train to System</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Add a train that students can register for. The train number will be auto-generated.
                    </p>
                    <form onSubmit={handleAddTrain}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Train Date</label>
                                <input
                                    type="date"
                                    value={addTrainForm.train_date}
                                    onChange={(e) => setAddTrainForm({ ...addTrainForm, train_date: e.target.value })}
                                    required
                                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Train Time</label>
                                <input
                                    type="time"
                                    value={addTrainForm.train_time}
                                    onChange={(e) => setAddTrainForm({ ...addTrainForm, train_time: e.target.value })}
                                    required
                                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Departing Station</label>
                                <input
                                    type="text"
                                    value={addTrainForm.departing_station}
                                    onChange={(e) => setAddTrainForm({ ...addTrainForm, departing_station: e.target.value })}
                                    required
                                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="e.g., Cleveland Union Station"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full border-2 border-black px-6 py-3 bg-black text-white hover:bg-white hover:text-black transition-colors font-medium disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Train'}
                        </button>
                    </form>

                    {trains.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-bold mb-2">Available Trains ({trains.length})</h4>
                            <div className="border border-gray-300 max-h-60 overflow-y-auto">
                                {trains.map((train, idx) => (
                                    <div key={idx} className="p-2 border-b border-gray-200 text-sm">
                                        <span className="font-medium">{train.train_no}</span> - {train.departing_station} on {train.train_date} at {train.train_time}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Register Train Form */}
            {activeTab === 'register-train' && (
                <div className="border-2 border-black p-6">
                    <h3 className="text-xl font-bold mb-4">Register Your Train Booking</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Register yourself on a train so others can find you for rideshare matching.
                    </p>
                    <form onSubmit={handleRegisterTrain}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Your Case ID</label>
                                <input
                                    type="text"
                                    value={registerTrainForm.case_id}
                                    onChange={(e) => setRegisterTrainForm({ ...registerTrainForm, case_id: e.target.value })}
                                    required
                                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="e.g., wxs428"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Train Number</label>
                                <input
                                    type="text"
                                    value={registerTrainForm.train_no}
                                    onChange={(e) => setRegisterTrainForm({ ...registerTrainForm, train_no: e.target.value })}
                                    required
                                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="e.g., CLE_20241215_1400"
                                />
                                <p className="text-xs text-gray-600 mt-1">Find train numbers in "Add Train" tab</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Confirmation Code</label>
                                <input
                                    type="text"
                                    value={registerTrainForm.confirmation_code}
                                    onChange={(e) => setRegisterTrainForm({ ...registerTrainForm, confirmation_code: e.target.value.toUpperCase() })}
                                    required
                                    className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black uppercase"
                                    placeholder="e.g., ABC123"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full border-2 border-black px-6 py-3 bg-black text-white hover:bg-white hover:text-black transition-colors font-medium disabled:opacity-50"
                        >
                            {loading ? 'Registering...' : 'Register Train'}
                        </button>
                    </form>
                </div>
            )}

            {/* My Bookings */}
            {activeTab === 'my-bookings' && (
                <div className="border-2 border-black p-6">
                    <h3 className="text-xl font-bold mb-4">View My Bookings</h3>
                    <form onSubmit={handleViewMyBookings} className="mb-6">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={myBookingsCaseId}
                                onChange={(e) => setMyBookingsCaseId(e.target.value)}
                                placeholder="Enter your Case ID"
                                required
                                className="flex-1 border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="border-2 border-black px-6 py-2 bg-black text-white hover:bg-white hover:text-black transition-colors font-medium disabled:opacity-50"
                            >
                                {loading ? 'Loading...' : 'View Bookings'}
                            </button>
                        </div>
                    </form>

                    {myBookings && (
                        <div>
                            {myBookings.flights && myBookings.flights.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-bold mb-2">Flight Bookings ({myBookings.flights.length})</h4>
                                    <div className="border border-gray-300">
                                        <div className="grid grid-cols-5 gap-4 p-3 border-b-2 border-gray-300 font-bold bg-gray-100">
                                            <div>Flight No</div>
                                            <div>Date</div>
                                            <div>Time</div>
                                            <div>Airport</div>
                                            <div>Confirmation</div>
                                        </div>
                                        {myBookings.flights.map((flight, idx) => (
                                            <div key={idx} className="grid grid-cols-5 gap-4 p-3 border-b border-gray-200">
                                                <div className="font-medium">{flight.flight_no}</div>
                                                <div>{flight.flight_date}</div>
                                                <div>{flight.flight_time}</div>
                                                <div>{flight.departing_airport}</div>
                                                <div className="text-sm">{flight.confirmation_code}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {myBookings.trains && myBookings.trains.length > 0 && (
                                <div>
                                    <h4 className="font-bold mb-2">Train Bookings ({myBookings.trains.length})</h4>
                                    <div className="border border-gray-300">
                                        <div className="grid grid-cols-5 gap-4 p-3 border-b-2 border-gray-300 font-bold bg-gray-100">
                                            <div>Train No</div>
                                            <div>Date</div>
                                            <div>Time</div>
                                            <div>Station</div>
                                            <div>Confirmation</div>
                                        </div>
                                        {myBookings.trains.map((train, idx) => (
                                            <div key={idx} className="grid grid-cols-5 gap-4 p-3 border-b border-gray-200">
                                                <div className="font-medium">{train.train_no}</div>
                                                <div>{train.train_date}</div>
                                                <div>{train.train_time}</div>
                                                <div>{train.departing_station}</div>
                                                <div className="text-sm">{train.confirmation_code}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(!myBookings.flights || myBookings.flights.length === 0) &&
                                (!myBookings.trains || myBookings.trains.length === 0) && (
                                    <div className="text-center py-8 text-gray-500">
                                        No bookings found for this Case ID.
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Bookings;

