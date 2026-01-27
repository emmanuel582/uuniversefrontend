import React, { useState, useEffect } from 'react';
import { Upload, FileText, Play, CheckCircle, AlertCircle, Building2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Leads = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState('');
    const [loadingCampaigns, setLoadingCampaigns] = useState(true);

    // Fetch campaigns on mount
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/campaigns`);
                setCampaigns(response.data);
                if (response.data.length > 0) {
                    setSelectedCampaign(response.data[0].id);
                }
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            } finally {
                setLoadingCampaigns(false);
            }
        };
        fetchCampaigns();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !selectedCampaign) return;

        setStatus('uploading');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('campaign_id', selectedCampaign);

        try {
            await axios.post(`${API_URL}/api/leads/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus('done');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    // ... rest of UI ...
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Visual upload component same as before */}
            <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Upload Lead List</h2>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    Upload a CSV file with columns: <code>phone</code>, <code>first_name</code>, <code>email</code>.
                </p>

                {/* Campaign Selector */}
                <div className="mb-6 max-w-md mx-auto">
                    <label className="block text-left text-sm font-medium text-slate-700 mb-2">
                        <Building2 size={16} className="inline mr-2" />
                        Select Campaign
                    </label>
                    {loadingCampaigns ? (
                        <p className="text-slate-400 text-sm">Loading campaigns...</p>
                    ) : campaigns.length === 0 ? (
                        <div className="p-3 bg-amber-50 text-amber-700 rounded-lg text-sm">
                            No campaigns found. Please create a campaign first.
                        </div>
                    ) : (
                        <select
                            value={selectedCampaign}
                            onChange={(e) => setSelectedCampaign(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            {campaigns.map((campaign) => (
                                <option key={campaign.id} value={campaign.id}>
                                    {campaign.name} ({campaign.business_name || 'No business name'})
                                </option>
                            ))}
                        </select>
                    )}
                    {selectedCampaign && campaigns.find(c => c.id === selectedCampaign) && (
                        <p className="mt-2 text-xs text-slate-500 text-left">
                            Agent will introduce as: <strong>{campaigns.find(c => c.id === selectedCampaign)?.business_name}</strong>
                        </p>
                    )}
                </div>

                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              mx-auto w-max
            "
                />

                {file && (
                    <div className="mt-6">
                        <button
                            onClick={handleUpload}
                            disabled={status === 'uploading' || status === 'done'}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                        >
                            {status === 'uploading' ? 'Uploading...' : 'Start Campaign'}
                            {status === 'idle' && <Play size={18} />}
                        </button>
                    </div>
                )}

                {status === 'done' && (
                    <div className="mt-4 p-4 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center gap-2">
                        <CheckCircle size={20} />
                        <span>Upload successful! Campaign has been queued.</span>
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center justify-center gap-2">
                        <AlertCircle size={20} />
                        <span>Upload failed. Please check the server logs.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leads;
