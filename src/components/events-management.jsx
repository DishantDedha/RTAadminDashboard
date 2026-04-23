'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { Trash2, Pencil } from 'lucide-react';
import {
  getEmeetingsAdminApi, createEmeetingApi, updateEmeetingApi, deleteEmeetingApi,
  getEvotingAdminApi, createEvotingApi, updateEvotingApi, deleteEvotingApi,
} from '@/app/api/eventsApi';

const TABS = { EMEETINGS: 'emeetings', EVOTING: 'evoting' };

const statusColors = {
  Upcoming: 'bg-blue-100 text-blue-700',
  Ongoing: 'bg-green-100 text-green-700',
  Closed: 'bg-red-100 text-red-700',
};

export default function EventsManagement() {
  const [activeTab, setActiveTab] = useState(TABS.EMEETINGS);

  // eMeetings state
  const [meetings, setMeetings] = useState([]);
  const [meetingForm, setMeetingForm] = useState({
    company: '', vc_start_datetime: '', reg_from_datetime: '', reg_to_datetime: '',
  });
  const [editingMeeting, setEditingMeeting] = useState(null);

  // eVoting state
  const [votings, setVotings] = useState([]);
  const [votingForm, setVotingForm] = useState({
    company: '', start_date: '', end_date: '', event_type: 'EGM', status_override: '',
  });
  const [editingVoting, setEditingVoting] = useState(null);

  const [loading, setLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchMeetings();
    fetchVotings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const res = await getEmeetingsAdminApi();
      setMeetings(res.data.data);
    } catch {
      showToast('Failed to fetch eMeetings.', 'error');
    }
  };

  const fetchVotings = async () => {
    try {
      const res = await getEvotingAdminApi();
      setVotings(res.data.data);
    } catch {
      showToast('Failed to fetch eVoting records.', 'error');
    }
  };

  // ─── eMeeting Handlers ────────────────────────────────
  const handleAddMeeting = async () => {
    if (!meetingForm.company || !meetingForm.vc_start_datetime || !meetingForm.reg_from_datetime || !meetingForm.reg_to_datetime) {
      showToast('All fields are required.', 'error');
      return;
    }
    try {
      setLoading(true);
      await createEmeetingApi(meetingForm);
      setMeetingForm({ company: '', vc_start_datetime: '', reg_from_datetime: '', reg_to_datetime: '' });
      showToast('eMeeting added!', 'success');
      fetchMeetings();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add eMeeting.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMeeting = async () => {
    try {
      setLoading(true);
      await updateEmeetingApi(editingMeeting.id, editingMeeting);
      setEditingMeeting(null);
      showToast('eMeeting updated!', 'success');
      fetchMeetings();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeeting = async (id) => {
    if (!confirm('Delete this eMeeting?')) return;
    try {
      await deleteEmeetingApi(id);
      showToast('eMeeting deleted.', 'success');
      fetchMeetings();
    } catch {
      showToast('Failed to delete.', 'error');
    }
  };

  // ─── eVoting Handlers ─────────────────────────────────
  const handleAddVoting = async () => {
    if (!votingForm.company || !votingForm.start_date || !votingForm.end_date || !votingForm.event_type) {
      showToast('All fields except status override are required.', 'error');
      return;
    }
    try {
      setLoading(true);
      await createEvotingApi({
        ...votingForm,
        status_override: votingForm.status_override || null,
      });
      setVotingForm({ company: '', start_date: '', end_date: '', event_type: 'EGM', status_override: '' });
      showToast('eVoting record added!', 'success');
      fetchVotings();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add eVoting record.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVoting = async () => {
    try {
      setLoading(true);
      await updateEvotingApi(editingVoting.id, {
        ...editingVoting,
        status_override: editingVoting.status_override || null,
      });
      setEditingVoting(null);
      showToast('eVoting record updated!', 'success');
      fetchVotings();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVoting = async (id) => {
    if (!confirm('Delete this eVoting record?')) return;
    try {
      await deleteEvotingApi(id);
      showToast('eVoting record deleted.', 'success');
      fetchVotings();
    } catch {
      showToast('Failed to delete.', 'error');
    }
  };

  const formatDateTime = (dt) => dt ? new Date(dt).toLocaleString('en-IN') : '—';

  return (
    <div className="max-w-5xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-dynamic">Events Management</h1>
        <p className="text-dynamic/70">Admin / Events</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {[
          { key: TABS.EMEETINGS, label: 'eMeetings' },
          { key: TABS.EVOTING, label: 'eVoting' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-dynamic/60 hover:text-dynamic'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── eMeetings Tab ─────────────────────────────── */}
      {activeTab === TABS.EMEETINGS && (
        <div className="space-y-6">
          {/* Add Form */}
          <Card className="card-dynamic border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-dynamic">Add eMeeting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2">Company Name</Label>
                <Input
                  value={meetingForm.company}
                  onChange={(e) => setMeetingForm({ ...meetingForm, company: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="mb-2">VC Start Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={meetingForm.vc_start_datetime}
                    onChange={(e) => setMeetingForm({ ...meetingForm, vc_start_datetime: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-2">Registration From</Label>
                  <Input
                    type="datetime-local"
                    value={meetingForm.reg_from_datetime}
                    onChange={(e) => setMeetingForm({ ...meetingForm, reg_from_datetime: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-2">Registration To</Label>
                  <Input
                    type="datetime-local"
                    value={meetingForm.reg_to_datetime}
                    onChange={(e) => setMeetingForm({ ...meetingForm, reg_to_datetime: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleAddMeeting} disabled={loading} className="w-full btn-dynamic text-white">
                Add eMeeting
              </Button>
            </CardContent>
          </Card>

          {/* List */}
          <Card className="card-dynamic border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-dynamic">Existing eMeetings ({meetings.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {meetings.length === 0 && <p className="text-dynamic/50 italic text-sm">No eMeetings yet.</p>}
              {meetings.map(m => (
                <div key={m.id} className="border border-gray-200 rounded-xl p-4">
                  {editingMeeting?.id === m.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingMeeting.company}
                        onChange={(e) => setEditingMeeting({ ...editingMeeting, company: e.target.value })}
                        placeholder="Company name"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <Label className="mb-1 text-xs">VC Start</Label>
                          <Input
                            type="datetime-local"
                            value={editingMeeting.vc_start_datetime?.slice(0, 16)}
                            onChange={(e) => setEditingMeeting({ ...editingMeeting, vc_start_datetime: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label className="mb-1 text-xs">Reg From</Label>
                          <Input
                            type="datetime-local"
                            value={editingMeeting.reg_from_datetime?.slice(0, 16)}
                            onChange={(e) => setEditingMeeting({ ...editingMeeting, reg_from_datetime: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label className="mb-1 text-xs">Reg To</Label>
                          <Input
                            type="datetime-local"
                            value={editingMeeting.reg_to_datetime?.slice(0, 16)}
                            onChange={(e) => setEditingMeeting({ ...editingMeeting, reg_to_datetime: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`m-active-${m.id}`}
                          checked={editingMeeting.is_active}
                          onChange={(e) => setEditingMeeting({ ...editingMeeting, is_active: e.target.checked })}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <Label htmlFor={`m-active-${m.id}`}>Active</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateMeeting} disabled={loading} className="flex-1 btn-dynamic text-white">Save</Button>
                        <Button variant="outline" onClick={() => setEditingMeeting(null)} className="flex-1">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-dynamic">{m.company}</p>
                        <p className="text-xs text-dynamic/60 mt-1">VC Start: {formatDateTime(m.vc_start_datetime)}</p>
                        <p className="text-xs text-dynamic/60">Reg: {formatDateTime(m.reg_from_datetime)} → {formatDateTime(m.reg_to_datetime)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${m.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {m.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingMeeting({ ...m })} className="text-blue-400 hover:text-blue-600">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteMeeting(m.id)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── eVoting Tab ───────────────────────────────── */}
      {activeTab === TABS.EVOTING && (
        <div className="space-y-6">
          {/* Add Form */}
          <Card className="card-dynamic border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-dynamic">Add eVoting Record</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2">Company Name</Label>
                <Input
                  value={votingForm.company}
                  onChange={(e) => setVotingForm({ ...votingForm, company: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">Start Date</Label>
                  <Input
                    type="datetime-local"
                    value={votingForm.start_date}
                    onChange={(e) => setVotingForm({ ...votingForm, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="mb-2">End Date</Label>
                  <Input
                    type="datetime-local"
                    value={votingForm.end_date}
                    onChange={(e) => setVotingForm({ ...votingForm, end_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
  <Label className="mb-2">Event Type</Label>
  <Input
    value={votingForm.event_type}
    onChange={(e) => setVotingForm({ ...votingForm, event_type: e.target.value })}
    placeholder="e.g. EGM, AGM, Postal Ballot"
  />
</div>
                <div>
                  <Label className="mb-2">
                    Status Override
                    <span className="text-dynamic/40 ml-1 text-xs">(leave empty for auto)</span>
                  </Label>
                  <select
                    value={votingForm.status_override}
                    onChange={(e) => setVotingForm({ ...votingForm, status_override: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-dynamic focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Auto (based on dates)</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleAddVoting} disabled={loading} className="w-full btn-dynamic text-white">
                Add eVoting Record
              </Button>
            </CardContent>
          </Card>

          {/* List */}
          <Card className="card-dynamic border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-dynamic">Existing eVoting Records ({votings.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {votings.length === 0 && <p className="text-dynamic/50 italic text-sm">No eVoting records yet.</p>}
              {votings.map(v => (
                <div key={v.id} className="border border-gray-200 rounded-xl p-4">
                  {editingVoting?.id === v.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingVoting.company}
                        onChange={(e) => setEditingVoting({ ...editingVoting, company: e.target.value })}
                        placeholder="Company name"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="mb-1 text-xs">Start Date</Label>
                          <Input
                            type="datetime-local"
                            value={editingVoting.start_date?.slice(0, 16)}
                            onChange={(e) => setEditingVoting({ ...editingVoting, start_date: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label className="mb-1 text-xs">End Date</Label>
                          <Input
                            type="datetime-local"
                            value={editingVoting.end_date?.slice(0, 16)}
                            onChange={(e) => setEditingVoting({ ...editingVoting, end_date: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
  <Label className="mb-1 text-xs">Event Type</Label>
  <Input
    value={editingVoting.event_type}
    onChange={(e) => setEditingVoting({ ...editingVoting, event_type: e.target.value })}
    placeholder="e.g. EGM, AGM, Postal Ballot"
  />
</div>
                        <div>
                          <Label className="mb-1 text-xs">Status Override</Label>
                          <select
                            value={editingVoting.status_override || ''}
                            onChange={(e) => setEditingVoting({ ...editingVoting, status_override: e.target.value })}
                            className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-dynamic"
                          >
                            <option value="">Auto</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`v-active-${v.id}`}
                          checked={editingVoting.is_active}
                          onChange={(e) => setEditingVoting({ ...editingVoting, is_active: e.target.checked })}
                          className="w-4 h-4 accent-blue-600"
                        />
                        <Label htmlFor={`v-active-${v.id}`}>Active</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateVoting} disabled={loading} className="flex-1 btn-dynamic text-white">Save</Button>
                        <Button variant="outline" onClick={() => setEditingVoting(null)} className="flex-1">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-dynamic">{v.company}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[v.computed_status] || 'bg-gray-100 text-gray-600'}`}>
                            {v.computed_status}
                            {v.status_override && ' (manual)'}
                          </span>
                        </div>
                        <p className="text-xs text-dynamic/60 mt-1">
                          {formatDateTime(v.start_date)} → {formatDateTime(v.end_date)}
                        </p>
                        <p className="text-xs text-dynamic/60">{v.event_type}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingVoting({ ...v })} className="text-blue-400 hover:text-blue-600">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteVoting(v.id)} className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}