
import React from 'react';

interface StatTableProps {
  title: string;
  data: Array<{ label: string; value: string | number }>;
}

export const StatTable: React.FC<StatTableProps> = ({ title, data }) => {
  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {data.map((row, idx) => (
          <div key={idx} className="flex justify-between items-center px-4 py-3 hover:bg-slate-50 transition-colors">
            <span className="text-sm text-slate-500">{row.label}</span>
            <span className="text-sm font-bold text-slate-900">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
