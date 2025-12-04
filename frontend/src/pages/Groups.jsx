import { useState, useEffect } from 'react';
import { api } from '../services/api';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [joinData, setJoinData] = useState({ case_id: '', group_id: '' });
  const [leaveData, setLeaveData] = useState({ case_id: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [groupsRes, studentsRes] = await Promise.all([
        api.getGroups(),
        api.getStudents()
      ]);
      setGroups(groupsRes.data || []);
      setStudents(studentsRes.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await api.createGroup({ group_name: newGroupName });
      setNewGroupName('');
      setShowCreateForm(false);
      loadData();
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group');
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    try {
      await api.joinGroup(joinData);
      setJoinData({ case_id: '', group_id: '' });
      setShowJoinForm(false);
      loadData();
      if (selectedGroup) {
        loadGroupMembers(selectedGroup.group_id);
      }
    } catch (error) {
      console.error('Error joining group:', error);
      alert('Failed to join group');
    }
  };

  const handleLeaveGroup = async (e) => {
    e.preventDefault();
    try {
      await api.leaveGroup(leaveData);
      setLeaveData({ case_id: '' });
      loadData();
      if (selectedGroup) {
        loadGroupMembers(selectedGroup.group_id);
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('Failed to leave group');
    }
  };

  const loadGroupMembers = async (groupId) => {
    try {
      const response = await api.getGroupMembers(groupId);
      setGroupMembers(response.data || []);
    } catch (error) {
      console.error('Error loading group members:', error);
      setGroupMembers([]);
    }
  };

  const selectGroup = (group) => {
    setSelectedGroup(group);
    loadGroupMembers(group.group_id);
  };

  if (loading) {
    return <div className="text-center py-12">Loading groups...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-2 text-center">Transport Groups</h2>
      <p className="text-center text-gray-600 mb-8">
        Create or join groups to coordinate rideshares with friends
      </p>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => { setShowCreateForm(!showCreateForm); setShowJoinForm(false); }}
          className={`px-6 py-3 border-2 border-black font-medium transition-colors ${
            showCreateForm ? 'bg-black text-white' : 'hover:bg-gray-100'
          }`}
        >
          Create New Group
        </button>
        <button
          onClick={() => { setShowJoinForm(!showJoinForm); setShowCreateForm(false); }}
          className={`px-6 py-3 border-2 border-black font-medium transition-colors ${
            showJoinForm ? 'bg-black text-white' : 'hover:bg-gray-100'
          }`}
        >
          Join/Leave Group
        </button>
      </div>

      {/* Create Group Form */}
      {showCreateForm && (
        <form onSubmit={handleCreateGroup} className="border-2 border-black p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Create New Group</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Group Name</label>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              required
              className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., Winter Break 2025 - CLE"
            />
          </div>
          <button
            type="submit"
            className="border-2 border-black px-6 py-2 bg-black text-white hover:bg-white hover:text-black transition-colors font-medium"
          >
            Create Group
          </button>
        </form>
      )}

      {/* Join/Leave Group Form */}
      {showJoinForm && (
        <div className="border-2 border-black p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Join Section */}
            <form onSubmit={handleJoinGroup}>
              <h3 className="text-xl font-bold mb-4">Join a Group</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Select Student</label>
                <select
                  value={joinData.case_id}
                  onChange={(e) => setJoinData({ ...joinData, case_id: e.target.value })}
                  required
                  className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">-- Select Student --</option>
                  {students.map((s) => (
                    <option key={s.case_id} value={s.case_id}>
                      {s.full_name} ({s.case_id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Select Group</label>
                <select
                  value={joinData.group_id}
                  onChange={(e) => setJoinData({ ...joinData, group_id: e.target.value })}
                  required
                  className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">-- Select Group --</option>
                  {groups.map((g) => (
                    <option key={g.group_id} value={g.group_id}>
                      {g.group_name} ({g.member_count} members)
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="border-2 border-black px-6 py-2 bg-black text-white hover:bg-white hover:text-black transition-colors font-medium"
              >
                Join Group
              </button>
            </form>

            {/* Leave Section */}
            <form onSubmit={handleLeaveGroup}>
              <h3 className="text-xl font-bold mb-4">Leave Your Group</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Select Student</label>
                <select
                  value={leaveData.case_id}
                  onChange={(e) => setLeaveData({ case_id: e.target.value })}
                  required
                  className="w-full border-2 border-black px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">-- Select Student --</option>
                  {students.filter(s => s.group_id).map((s) => (
                    <option key={s.case_id} value={s.case_id}>
                      {s.full_name} ({s.case_id})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="border-2 border-black px-6 py-2 bg-white text-black hover:bg-black hover:text-white transition-colors font-medium"
              >
                Leave Group
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* All Groups */}
        <div className="border-2 border-black">
          <div className="p-4 border-b-2 border-black bg-black text-white font-bold">
            All Groups ({groups.length})
          </div>
          {groups.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No groups yet. Create one to get started!
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {groups.map((group) => (
                <div
                  key={group.group_id}
                  onClick={() => selectGroup(group)}
                  className={`p-4 border-b border-gray-300 cursor-pointer hover:bg-gray-50 ${
                    selectedGroup?.group_id === group.group_id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="font-bold">{group.group_name}</div>
                  <div className="text-sm text-gray-600">
                    {group.member_count} member{group.member_count !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Group Members */}
        <div className="border-2 border-black">
          <div className="p-4 border-b-2 border-black bg-black text-white font-bold">
            {selectedGroup ? `Members: ${selectedGroup.group_name}` : 'Select a Group'}
          </div>
          {!selectedGroup ? (
            <div className="p-8 text-center text-gray-500">
              Click on a group to see its members
            </div>
          ) : groupMembers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No members in this group yet
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {groupMembers.map((member) => (
                <div
                  key={member.case_id}
                  className="p-4 border-b border-gray-300 hover:bg-gray-50"
                >
                  <div className="font-bold">{member.full_name}</div>
                  <div className="text-sm text-gray-600">
                    {member.case_id} • Year {member.year_of_study}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-4 bg-gray-100 border border-gray-300">
        <p className="font-medium mb-2">How Groups Work:</p>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Create a group for your travel party (e.g., friends going home for break)</li>
          <li>When one member is matched, all group members are included</li>
          <li>Perfect for coordinating rideshares with your friend group</li>
        </ul>
      </div>
    </div>
  );
}

export default Groups;

