import { useState, useEffect } from 'react';
import { api } from '../services/api';

function FindMatches() {
  const [travelType, setTravelType] = useState('flight');
  const [matches, setMatches] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [searchInfo, setSearchInfo] = useState(null);

  const [flightForm, setFlightForm] = useState({
    departing_airport: '',
    flight_date: '',
    flight_time: '',
    time_window: 2
  });

  const [trainForm, setTrainForm] = useState({
    departing_station: '',
    train_date: '',
    train_time: '',
    time_window: 2
  });

  const [groupForm, setGroupForm] = useState({
    group_id: ''
  });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await api.getGroups();
      setGroups(response.data || []);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const handleFlightSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const response = await api.findFlightMatches(flightForm);
      setMatches(response.data.matches || []);
      setSearchInfo(null);
    } catch (error) {
      console.error('Error finding matches:', error);
      alert('Error finding matches. Check console for details.');
      setMatches([]);
    }
    setLoading(false);
  };

  const handleTrainSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const response = await api.findTrainMatches(trainForm);
      setMatches(response.data.matches || []);
      setSearchInfo(null);
    } catch (error) {
      console.error('Error finding matches:', error);
      alert('Error finding matches. Check console for details.');
      setMatches([]);
    }
    setLoading(false);
  };

  const handleGroupSearch = async (e) => {
    e.preventDefault();
    if (!groupForm.group_id) {
      alert('Please select a group');
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const response = await api.findGroupMatches(groupForm.group_id);
      setMatches(response.data.matches || []);
      setSearchInfo(response.data.search_info || null);
    } catch (error) {
      console.error('Error finding group matches:', error);
      alert('Error finding matches. Check console for details.');
      setMatches([]);
      setSearchInfo(null);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-2 text-center">Find Rideshare Matches</h2>
      <p className="text-center text-gray-600 mb-8">
        Match with students traveling to the same destination within your time window
      </p>

      {/* Travel Type Selector */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => { setTravelType('flight'); setSearched(false); setMatches([]); setSearchInfo(null); }}
          className={`px-6 py-3 border-2 border-black font-medium transition-colors ${
            travelType === 'flight'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          Flight Matching
        </button>
        <button
          onClick={() => { setTravelType('train'); setSearched(false); setMatches([]); setSearchInfo(null); }}
          className={`px-6 py-3 border-2 border-black font-medium transition-colors ${
            travelType === 'train'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          Train Matching
        </button>
        <button
          onClick={() => { setTravelType('group'); setSearched(false); setMatches([]); setSearchInfo(null); }}
          className={`px-6 py-3 border-2 border-black font-medium transition-colors ${
            travelType === 'group'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-gray-100'
          }`}
        >
          Group Matching
        </button>
      </div>

      {/* Flight Search Form */}
      {travelType === 'flight' && (
        <form onSubmit={handleFlightSearch} className="border-2 border-black p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Search Flight Matches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Departing Airport</label>
              <input
                type="text"
                value={flightForm.departing_airport}
                onChange={(e) => setFlightForm({ ...flightForm, departing_airport: e.target.value.toUpperCase() })}
                required
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black uppercase"
                placeholder="e.g., CLE, JFK, LAX"
                maxLength="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Flight Date</label>
              <input
                type="date"
                value={flightForm.flight_date}
                onChange={(e) => setFlightForm({ ...flightForm, flight_date: e.target.value })}
                required
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Flight Time</label>
              <input
                type="time"
                value={flightForm.flight_time}
                onChange={(e) => setFlightForm({ ...flightForm, flight_time: e.target.value })}
                required
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time Window (hours)</label>
              <input
                type="number"
                value={flightForm.time_window}
                onChange={(e) => setFlightForm({ ...flightForm, time_window: parseInt(e.target.value) })}
                min="1"
                max="12"
                required
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <p className="text-xs text-gray-600 mt-1">Find flights within ±{flightForm.time_window} hours</p>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-black px-6 py-3 bg-black text-white hover:bg-white hover:text-black transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Find Flight Matches'}
          </button>
        </form>
      )}

      {/* Train Search Form */}
      {travelType === 'train' && (
        <form onSubmit={handleTrainSearch} className="border-2 border-black p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Search Train Matches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Departing Station</label>
              <input
                type="text"
                value={trainForm.departing_station}
                onChange={(e) => setTrainForm({ ...trainForm, departing_station: e.target.value })}
                required
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., Cleveland Union Station"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Train Date</label>
              <input
                type="date"
                value={trainForm.train_date}
                onChange={(e) => setTrainForm({ ...trainForm, train_date: e.target.value })}
                required
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Train Time</label>
              <input
                type="time"
                value={trainForm.train_time}
                onChange={(e) => setTrainForm({ ...trainForm, train_time: e.target.value })}
                required
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time Window (hours)</label>
              <input
                type="number"
                value={trainForm.time_window}
                onChange={(e) => setTrainForm({ ...trainForm, time_window: parseInt(e.target.value) })}
                min="1"
                max="12"
                required
                className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <p className="text-xs text-gray-600 mt-1">Find trains within ±{trainForm.time_window} hours</p>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-black px-6 py-3 bg-black text-white hover:bg-white hover:text-black transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Find Train Matches'}
          </button>
        </form>
      )}

      {/* Group Search Form */}
      {travelType === 'group' && (
        <form onSubmit={handleGroupSearch} className="border-2 border-black p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Search Group Matches</h3>
          <p className="text-sm text-gray-600 mb-4">
            Find rideshare matches for your entire group. The system will use one group member's flight to search for other students and groups.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select Your Group</label>
            <select
              value={groupForm.group_id}
              onChange={(e) => setGroupForm({ ...groupForm, group_id: e.target.value })}
              required
              className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">-- Select a Group --</option>
              {groups.map((group) => (
                <option key={group.group_id} value={group.group_id}>
                  {group.group_name} ({group.member_count} members)
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-600 mt-1">
              At least one group member must have a registered flight
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-black px-6 py-3 bg-black text-white hover:bg-white hover:text-black transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Find Group Matches'}
          </button>
        </form>
      )}

      {/* Results Section */}
      {searched && (
        <div className="border-2 border-black p-6">
          {/* Search Info for Group Matching */}
          {travelType === 'group' && searchInfo && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200">
              <p className="font-medium mb-2">Searching based on group member's flight:</p>
              <div className="text-sm space-y-1">
                <p><strong>Member:</strong> {searchInfo.member_name} ({searchInfo.member_case_id})</p>
                <p><strong>Destination:</strong> {searchInfo.departing_airport}</p>
                <p><strong>Date:</strong> {searchInfo.flight_date}</p>
                <p><strong>Time:</strong> {searchInfo.flight_time}</p>
                <p className="text-gray-600 mt-2">Search window: ±2 hours</p>
              </div>
            </div>
          )}

          <h3 className="text-xl font-bold mb-4">
            {matches.length > 0
              ? `Found ${matches.length} Match${matches.length !== 1 ? 'es' : ''}`
              : 'No Matches Found'
            }
          </h3>

          {matches.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>No students found with matching {travelType} details.</p>
              {travelType === 'group' ? (
                <p className="text-sm mt-2">Make sure at least one group member has registered a flight.</p>
              ) : (
                <p className="text-sm mt-2">Try adjusting your time window or search criteria.</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match, idx) => (
                <div key={idx} className="border border-gray-300 p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg">{match.full_name}</p>
                      <p className="text-sm text-gray-600">Case ID: {match.case_id}</p>
                    </div>
                    <div className="text-right">
                      {(travelType === 'flight' || travelType === 'group') && (
                        <>
                          <p className="font-medium">{match.flight_no}</p>
                          {match.departing_airport && (
                            <p className="text-sm">{match.departing_airport}</p>
                          )}
                        </>
                      )}
                      {travelType === 'train' && (
                        <>
                          <p className="font-medium">{match.train_no}</p>
                          <p className="text-sm">{match.departing_station}</p>
                        </>
                      )}
                    </div>
                  </div>
                  {(travelType === 'flight' || (travelType === 'group' && match.flight_date)) && (
                    <div className="mt-2 flex gap-4 text-sm">
                      <span className="font-medium">
                        Date: {match.flight_date}
                      </span>
                      <span className="font-medium">
                        Time: {match.flight_time || 'N/A'}
                      </span>
                    </div>
                  )}
                  {travelType === 'train' && (
                    <div className="mt-2 flex gap-4 text-sm">
                      <span className="font-medium">
                        Date: {match.train_date}
                      </span>
                      <span className="font-medium">
                        Time: {match.train_time}
                      </span>
                    </div>
                  )}
                  {travelType === 'group' && match.flight_no === 'GROUP MEMBER' && (
                    <div className="mt-2">
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        Part of matched group
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {matches.length > 0 && (
            <div className="mt-6 p-4 bg-gray-100 border border-gray-300">
              <p className="font-medium mb-2">Next Steps:</p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Contact matched students{travelType === 'group' ? '/groups' : ''} to coordinate rideshare</li>
                <li>Decide on pickup location and time</li>
                <li>Split the Uber/Lyft cost evenly{travelType === 'group' ? ' among all travelers' : ''}</li>
                {travelType === 'group' && (
                  <li>Remember: Group members travel together, so coordinate within your group first</li>
                )}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FindMatches;
