import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Save, Trash2, Edit, X, Phone } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingCampaignId, setEditingCampaignId] = useState(null); // Track if editing existing campaign
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        business_name: '',
        agent_name: '',
        call_purpose: '',
        campaign_summary: '',
        qualifying_questions: '',
        agent_id: '',
        from_number: '',
        calendly_event_uri: '',
        calendly_token: '',
        notification_email: ''
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

    const resetForm = () => {
        setFormData({
            id: '',
            name: '',
            business_name: '',
            agent_name: '',
            call_purpose: '',
            campaign_summary: '',
            qualifying_questions: '',
            agent_id: '',
            from_number: '',
            calendly_event_uri: '',
            calendly_token: '',
            notification_email: ''
        });
        setEditingCampaignId(null);
        setIsEditing(false);
    };

    const handleEdit = (campaign) => {
        // Convert qualifying_questions array to string for editing
        let questionsStr = '';
        if (Array.isArray(campaign.qualifying_questions)) {
            questionsStr = campaign.qualifying_questions.join('\n');
        } else if (typeof campaign.qualifying_questions === 'string') {
            questionsStr = campaign.qualifying_questions;
        }

        setFormData({
            id: campaign.id,
            name: campaign.name || '',
            business_name: campaign.business_name || '',
            agent_name: campaign.agent_name || '',
            call_purpose: campaign.call_purpose || '',
            campaign_summary: campaign.campaign_summary || '',
            qualifying_questions: questionsStr,
            agent_id: campaign.agent_id || '',
            from_number: campaign.from_number || '',
            calendly_event_uri: campaign.calendly_event_uri || '',
            calendly_token: campaign.calendly_token || '',
            notification_email: campaign.notification_email || ''
        });
        setEditingCampaignId(campaign.id);
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/campaigns`, formData);
            resetForm();
            fetchCampaigns();
        } catch (err) {
            alert('Error saving campaign: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (campaignId) => {
        if (!window.confirm('Are you sure you want to delete this campaign?')) {
            return;
        }
        try {
            await axios.delete(`${API_URL}/api/campaigns/${campaignId}`);
            fetchCampaigns();
        } catch (err) {
            alert('Error deleting campaign: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Campaign Management</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={18} /> New Campaign
                    </button>
                )}
            </div>

            {isEditing && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">
                            {editingCampaignId ? 'Edit Campaign' : 'New Campaign'}
                        </h3>
                        <button
                            onClick={resetForm}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Campaign ID (Unique)</label>
                            <input
                                required
                                className="w-full p-2 border border-slate-300 rounded block disabled:bg-slate-100 disabled:cursor-not-allowed"
                                value={formData.id}
                                onChange={e => setFormData({ ...formData, id: e.target.value })}
                                placeholder="e.g. Q1_SALES"
                                disabled={!!editingCampaignId} // Disable ID editing for existing campaigns
                            />
                            {editingCampaignId && (
                                <p className="text-xs text-amber-600 mt-1">Campaign ID cannot be changed</p>
                            )}
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
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Summary *</label>
                            <textarea
                                required
                                className="w-full p-2 border border-slate-300 rounded block resize-none"
                                rows={3}
                                value={formData.campaign_summary}
                                onChange={e => setFormData({ ...formData, campaign_summary: e.target.value })}
                                placeholder="e.g. We help commercial real estate owners with financing solutions and insurance coverage. I'm reaching out to see if you have any upcoming needs."
                            />
                            <p className="text-xs text-slate-500 mt-1">A 1-2 sentence pitch explaining why you are calling.</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Qualifying Questions *</label>
                            <textarea
                                required
                                className="w-full p-2 border border-slate-300 rounded block resize-none"
                                rows={4}
                                value={formData.qualifying_questions}
                                onChange={e => setFormData({ ...formData, qualifying_questions: e.target.value })}
                                placeholder="Enter each question on a new line, e.g.:
Have you ever worked with us before?
Do you have any upcoming financing needs in the next 60-90 days?
What's the best email to send more information to?"
                            />
                            <p className="text-xs text-slate-500 mt-1">Questions the agent should ask. Enter each question on a new line.</p>
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

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Notification Email *</label>
                            <input
                                required
                                type="email"
                                className="w-full p-2 border border-slate-300 rounded block"
                                value={formData.notification_email}
                                onChange={e => setFormData({ ...formData, notification_email: e.target.value })}
                                placeholder="team-member@example.com"
                            />
                            <p className="text-xs text-slate-500 mt-1">Internal email to notify when a lead requests information.</p>
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center gap-2 transition-colors"
                            >
                                <Save size={18} /> {editingCampaignId ? 'Update' : 'Save'}
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
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(c)}
                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                    title="Edit Campaign"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(c.id)}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    title="Delete Campaign"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600">
                            <p><span className="font-medium text-slate-900">Business:</span> {c.business_name || 'Not set'}</p>
                            <p><span className="font-medium text-slate-900">Agent Name:</span> {c.agent_name || 'Sarah'}</p>
                            <p><span className="font-medium text-slate-900">Purpose:</span> {c.call_purpose || 'Not set'}</p>
                            {c.campaign_summary && <p className="truncate"><span className="font-medium text-slate-900">Summary:</span> {c.campaign_summary}</p>}
                            {c.qualifying_questions && (
                                <p className="text-xs text-blue-600 font-medium">
                                    {Array.isArray(c.qualifying_questions) ? c.qualifying_questions.length : c.qualifying_questions.split('\n').filter(q => q.trim()).length} Qualifying Questions
                                </p>
                            )}
                            <p><span className="font-medium text-slate-900">Agent ID:</span> {c.agent_id?.substr(0, 12)}...</p>
                            <p><span className="font-medium text-slate-900">Phone:</span> {c.from_number}</p>
                            <p className="truncate"><span className="font-medium text-slate-900">Calendly:</span> {c.calendly_event_uri?.split('/').pop()}</p>
                            {c.calendly_token && <p className="text-xs text-emerald-600 font-medium">Custom Token Active</p>}
                            <p className="truncate"><span className="font-medium text-slate-900">Notify:</span> {c.notification_email || 'Not set'}</p>
                        </div>
                    </div>
                ))}
                {campaigns.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200">
                        <div className="text-slate-400 mb-4">
                            <Phone size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-600 mb-2">No campaigns yet</h3>
                        <p className="text-slate-500 mb-4">Create your first campaign to get started</p>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={18} className="inline mr-2" /> Create Campaign
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Campaigns;
