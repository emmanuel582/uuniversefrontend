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
    const [stats, setStats] = useState({ total: 0, queued: 0, failed: 0, recent: [] });

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

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Total Logs"
                    value={stats.total}
                    icon={Users}
                    color="bg-indigo-500"
                />
                <StatCard
                    label="Queued Calls"
                    value={stats.queued}
                    icon={Phone}
                    color="bg-blue-500"
                />
                <StatCard
                    label="Failed/Errors"
                    value={stats.failed}
                    icon={CalendarCheck}
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
                                    setStats({ total: 0, queued: 0, failed: 0, recent: [] });
                                }
                            }}
                            className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            Clear Logs
                        </button>
                    </div>
                    <div className="space-y-4">
                        {stats.recent.length === 0 && <p className="text-slate-500">No activity logged.</p>}
                        {stats.recent.map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                                        {log.first_name ? log.first_name[0] : '?'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{log.first_name} {log.last_name}</p>
                                        <p className="text-sm text-slate-500">{log.phone}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-sm font-medium px-2 py-1 rounded ${log.status === 'QUEUED' ? 'bg-blue-100 text-blue-700' :
                                        log.status === 'SUPPRESSED' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {log.status}
                                    </span>
                                    <p className="text-xs text-slate-400 mt-1">{new Date(log.timestamp).toLocaleTimeString()}</p>
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
