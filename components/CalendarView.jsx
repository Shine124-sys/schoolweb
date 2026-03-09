'use client';
import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import toast from 'react-hot-toast';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const locales = {
    'en-US': require('date-fns/locale/en-US'),
};
const localizer = dateFnsLocalizer({
    format, parse, startOfWeek, getDay, locales,
});

export default function CalendarView({ isAdmin = false }) {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', date: '', endDate: '', type: 'event', description: '' });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/calendar');
            const data = await res.json();
            if (data.success) {
                // Map to react-big-calendar format
                const mapped = data.data.map(e => ({
                    id: e._id,
                    title: e.title,
                    start: new Date(e.date),
                    end: e.endDate ? new Date(e.endDate) : new Date(e.date),
                    type: e.type,
                    desc: e.description
                }));
                setEvents(mapped);
            }
        } catch (err) {
            toast.error('Failed to load calendar events');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/calendar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Event added');
                setShowForm(false);
                fetchEvents();
                setForm({ title: '', date: '', endDate: '', type: 'event', description: '' });
            } else {
                throw new Error(data.error);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this event?')) return;
        try {
            await fetch(`/api/calendar/${id}`, { method: 'DELETE' });
            toast.success('Event deleted');
            setEvents(events.filter(e => e.id !== id));
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const eventStyleGetter = (event) => {
        let style = { borderRadius: '6px', opacity: 0.9, color: 'white', border: 'none', display: 'block', fontSize: '12px' };
        if (event.type === 'holiday') style.backgroundColor = '#ef4444'; // red
        else if (event.type === 'exam') style.backgroundColor = '#8b5cf6'; // violet
        else style.backgroundColor = '#3b82f6'; // blue
        return { style };
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">School Calendar</h2>
                    <div className="flex gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Event</span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500"><div className="w-3 h-3 rounded-full bg-red-500"></div> Holiday</span>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500"><div className="w-3 h-3 rounded-full bg-violet-500"></div> Exam</span>
                    </div>
                </div>
                {isAdmin && (
                    <button onClick={() => setShowForm(true)} className="btn-primary py-1.5 px-3">
                        <PlusIcon className="w-4 h-4" /> Add Event
                    </button>
                )}
            </div>

            <div className="h-[600px] overflow-hidden">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%', fontFamily: 'Inter, sans-serif' }}
                    eventPropGetter={eventStyleGetter}
                    onSelectEvent={e => isAdmin ? handleDelete(e.id) : alert(e.title + (e.desc ? `\n\n${e.desc}` : ''))}
                    views={['month', 'agenda']}
                    popup
                />
            </div>

            {showForm && isAdmin && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Add Calendar Event</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="form-label">Title</label>
                                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="form-input" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="form-label">Start Date</label>
                                    <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="form-input text-xs" />
                                </div>
                                <div>
                                    <label className="form-label">End Date (Opt)</label>
                                    <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="form-input text-xs" />
                                </div>
                            </div>
                            <div>
                                <label className="form-label">Type</label>
                                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="form-select">
                                    <option value="event">Event</option>
                                    <option value="holiday">Holiday</option>
                                    <option value="exam">Exam</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label">Description (Opt)</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="form-input min-h-[80px]"></textarea>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" className="btn-primary flex-1 justify-center">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
