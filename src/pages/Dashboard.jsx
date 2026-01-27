import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowUpRight, Phone, CalendarCheck, Users } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
    </div>
);

const TestCallForm = () => {
    const [phone, setPhone] = useState('');
    const [status, setStatus] = useState('idle');

    const handleCall = async (e) => {
        e.preventDefault();
        if (!phone) return;
        setStatus('calling');
        try {
            await axios.post(`${API_URL}/api/test-call`, { phone, first_name: 'Admin' });
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (e) {
            console.error(e);
            alert('Call failed: ' + (e.response?.data?.error || e.message));
            setStatus('idle');
        }
    };

    return (
        <form onSubmit={handleCall} className="flex gap-3">
            <input
                type="text"
                placeholder="+15550001234"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
                type="submit"
                disabled={status === 'calling'}
                className="bg-white text-blue-700 font-bold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-75"
            >
                {status === 'calling' ? 'Calling...' : status === 'success' ? 'Ringing!' : 'Call Me'}
            </button>
        </form>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, queued: 0, completed: 0, failed: 0, dialed: 0, recent: [] });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/stats`);
                setStats(res.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchStats();
        // Auto-refresh every 5 seconds to update call statuses
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    // Status badge color helper
    const getStatusColor = (status, type, outcome) => {
        if (outcome || type === 'call_outcome') {
            if (status?.includes('Booked') || outcome?.includes('Booked')) return 'bg-emerald-100 text-emerald-700';
            if (status === 'Call Back' || outcome === 'Call Back') return 'bg-amber-100 text-amber-700';
            if (status === 'Not Interested' || outcome === 'Not Interested') return 'bg-slate-100 text-slate-600';
            if (status === 'Opt-Out' || outcome === 'Opt-Out') return 'bg-red-100 text-red-700';
            return 'bg-purple-100 text-purple-700';
        }
        if (status === 'QUEUED') return 'bg-blue-100 text-blue-700';
        if (status === 'SENT') return 'bg-emerald-100 text-emerald-700';
        if (status === 'SUPPRESSED') return 'bg-yellow-100 text-yellow-700';
        if (status?.includes('FAILED') || status?.includes('SKIPPED')) return 'bg-red-100 text-red-700';
        return 'bg-slate-100 text-slate-600';
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    label="Total Calls"
                    value={stats.dialed || stats.total}
                    icon={Users}
                    color="bg-indigo-500"
                />
                <StatCard
                    label="In Progress"
                    value={stats.queued}
                    icon={Phone}
                    color="bg-blue-500"
                />
                <StatCard
                    label="Completed"
                    value={stats.completed}
                    icon={CalendarCheck}
                    color="bg-emerald-500"
                />
                <StatCard
                    label="Failed"
                    value={stats.failed}
                    icon={ArrowUpRight}
                    color="bg-red-500"
                />
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
                        <button
                            onClick={async () => {
                                if (confirm('Are you sure you want to clear all call logs?')) {
                                    await axios.delete(`${API_URL}/api/stats`);
                                    setStats({ total: 0, queued: 0, completed: 0, failed: 0, dialed: 0, recent: [] });
                                }
                            }}
                            className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            Clear Logs
                        </button>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {stats.recent.length === 0 && <p className="text-slate-500">No activity logged.</p>}
                        {stats.recent.map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                        {(log.first_name || log.customer_name || log.name || '?')[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {log.customer_name || log.first_name || log.name || 'Unknown'}
                                            {log.last_name ? ` ${log.last_name}` : ''}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {log.phone || log.customer_phone || log.email || log.customer_email || 'No contact'}
                                        </p>
                                        {log.campaign_id && (
                                            <p className="text-xs text-slate-400 font-mono">{log.campaign_id}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-sm font-medium px-2 py-1 rounded ${getStatusColor(log.status, log.type, log.outcome)}`}>
                                        {log.outcome || log.status || log.type || 'Unknown'}
                                    </span>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
