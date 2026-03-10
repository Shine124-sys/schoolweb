export default function DashboardCard({ title, value, subtitle, icon: Icon, color = 'indigo', trend }) {
    const colorMap = {
        indigo: 'from-indigo-500 to-indigo-600',
        emerald: 'from-emerald-500 to-emerald-600',
        amber: 'from-amber-500 to-amber-600',
        red: 'from-red-500 to-red-600',
        blue: 'from-blue-500 to-blue-600',
        violet: 'from-violet-500 to-violet-600',
    };
    const bgMap = {
        indigo: 'bg-indigo-50',
        emerald: 'bg-emerald-50',
        amber: 'bg-amber-50',
        red: 'bg-red-50',
        blue: 'bg-blue-50',
        violet: 'bg-violet-50',
    };

    return (
        <div className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                    {Icon && <Icon className="w-6 h-6 text-white" />}
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {trend > 0 ? '+' : ''}{trend}%
                    </span>
                )}
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-800 mb-0.5">{value}</p>
                <p className="text-sm font-medium text-slate-600">{title}</p>
                {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
}
