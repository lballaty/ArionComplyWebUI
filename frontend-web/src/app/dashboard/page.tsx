import React from 'react';

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Compliance Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-2">Overall Compliance</h3>
          <p className="text-3xl font-bold text-green-600">87%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-2">Active Risks</h3>
          <p className="text-3xl font-bold text-yellow-600">23</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-2">Completed Audits</h3>
          <p className="text-3xl font-bold text-blue-600">156</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-2">Training Progress</h3>
          <p className="text-3xl font-bold text-green-600">94%</p>
        </div>
      </div>
    </div>
  );
}
