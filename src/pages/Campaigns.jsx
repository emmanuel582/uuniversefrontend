import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Save, Trash2, Edit } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        business_name: '',
        agent_name: '',
        call_purpose: '',
        agent_id: '',
        from_number: '',
        calendly_event_uri: '',
        calendly_token: ''
    });

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/campaigns`);
            setCampaigns(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/campaigns`, formData);
            setIsEditing(false);
            fetchCampaigns();
            setFormData({ id: '', name: '', business_name: '', agent_name: '', call_purpose: '', agent_id: '', from_number: '', calendly_event_uri: '', calendly_token: '' });
        } catch (err) {
            alert('Error saving campaign: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Campaign Management</h2>
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={18} /> New Campaign
                </button>
            </div>

            {isEditing && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-lg mb-4">Edit Campaign</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Campaign ID (Unique)</label>
                            <input
                                required
                                className="w-full p-2 border border-slate-300 rounded block"
                                value={formData.id}
                                onChange={e => setFormData({ ...formData, id: e.target.value })}
                                placeholder="e.g. Q1_SALES"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Friendly Name</label>
                            <input
                                required
                                className="w-full p-2 border border-slate-300 rounded block"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Q1 Sales Outreach"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Business Name *</label>
                            <input
                                required
                                className="w-full p-2 border border-slate-300 rounded block"
                                value={formData.business_name}
                                onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                                placeholder="e.g. ABC Corporation"
                            />
                            <p className="text-xs text-slate-500 mt-1">Agent will say: "I'm calling from [this name]"</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Agent Name *</label>
                            <input
                                required
                                className="w-full p-2 border border-slate-300 rounded block"
                                value={formData.agent_name}
                                onChange={e => setFormData({ ...formData, agent_name: e.target.value })}
                                placeholder="e.g. Sarah, Mike, Jacob"
                            />
                            <p className="text-xs text-slate-500 mt-1">Agent will say: "Hi, this is [this name] calling from..."</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Call Purpose</label>
                            <input
                                className="w-full p-2 border border-slate-300 rounded block"
                                value={formData.call_purpose}
                                onChange={e => setFormData({ ...formData, call_purpose: e.target.value })}
                                placeholder="e.g. to discuss how we can help grow your business"
                            />
                            <p className="text-xs text-slate-500 mt-1">Agent will say: "I'm calling [this purpose]"</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Retell Agent ID</label>
                            <input
                                required
                                className="w-full p-2 border border-slate-300 rounded block"
                                value={formData.agent_id}
                                onChange={e => setFormData({ ...formData, agent_id: e.target.value })}
                                placeholder="agent_..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">From Number (E.164)</label>
                            <input
                                required
                                className="w-full p-2 border border-slate-300 rounded block"
                                value={formData.from_number}
                                onChange={e => setFormData({ ...formData, from_number: e.target.value })}
                                placeholder="+12223334444"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Calendly Event URI</label>
                            <input
                                required
                                className="w-full p-2 border border-slate-300 rounded block"
                                value={formData.calendly_event_uri}
                                onChange={e => setFormData({ ...formData, calendly_event_uri: e.target.value })}
                                placeholder="https://api.calendly.com/event_types/..."
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Calendly Token (Optional)</label>
                            <input
                                className="w-full p-2 border border-slate-300 rounded block"
                                value={formData.calendly_token}
                                onChange={e => setFormData({ ...formData, calendly_token: e.target.value })}
                                placeholder="Overwrite default token for this campaign..."
                                type="password"
                            />
                            <p className="text-xs text-slate-500 mt-1">Leave blank to use the server default token.</p>
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center gap-2"
                            >
                                <Save size={18} /> Save
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map(c => (
                    <div key={c.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{c.name}</h3>
                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">{c.id}</span>
                            </div>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Edit size={16} />
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600">
                            <p><span className="font-medium text-slate-900">Business:</span> {c.business_name || 'Not set'}</p>
                            <p><span className="font-medium text-slate-900">Agent Name:</span> {c.agent_name || 'Sarah'}</p>
                            <p><span className="font-medium text-slate-900">Purpose:</span> {c.call_purpose || 'Not set'}</p>
                            <p><span className="font-medium text-slate-900">Agent ID:</span> {c.agent_id?.substr(0, 12)}...</p>
                            <p><span className="font-medium text-slate-900">Phone:</span> {c.from_number}</p>
                            <p className="truncate"><span className="font-medium text-slate-900">Calendly:</span> {c.calendly_event_uri.split('/').pop()}</p>
                            {c.calendly_token && <p className="text-xs text-emerald-600 font-medium">Custom Token Active</p>}
                        </div>
                    </div>
                ))}
                {/* ... empty state ... */}
            </div>
        </div>
    );
};

export default Campaigns;
