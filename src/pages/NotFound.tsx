import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className="py-24 text-center space-y-6 max-w-md mx-auto">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
        404 // ROUTE ANOMALY
      </div>
      <h1 className="font-sans font-semibold text-5xl text-white">
        Sector Not Found
      </h1>
      <p className="text-slate-400 text-sm font-light font-sans">
        The roadway inspection coordinate or document you requested does not exist on the current active patrol grid.
      </p>
      <div className="pt-2">
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-card btn-silver font-mono text-xs font-bold uppercase tracking-[0.2em]"
        >
          RETURN TO DASHBOARD
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
