import React from 'react';
import { cn } from '../../utils/cn';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ headers, children, className }) => {
  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900", className)}>
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-slate-800/50 border-b border-slate-800">
            {headers.map((header, i) => (
              <th key={i} className="px-6 py-4 font-semibold text-slate-300">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <tr className={cn("hover:bg-slate-800/30 transition-colors", className)}>
    {children}
  </tr>
);

export const TableCell: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
  <td className={cn("px-6 py-4 text-slate-400 whitespace-nowrap", className)}>
    {children}
  </td>
);
