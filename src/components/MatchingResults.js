import React from 'react';
import { saveAs } from 'file-saver';

const MatchingResults = ({ results }) => {
  const downloadCSV = () => {
    const headers = 'mentor_id,mentees\n';
    const rows = Object.entries(results)
      .map(([mentorId, mentees]) => `${mentorId},${mentees.join(',')}`)
      .join('\n');
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'results.csv');
  };

  return (
    <div>
      <h2 className="text-xl font-bold mt-4">Matching Results</h2>
      <table className="table-auto w-full mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Mentor ID</th>
            <th className="border px-4 py-2">Mentees</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(results).map(([mentorId, mentees]) => (
            <tr key={mentorId}>
              <td className="border px-4 py-2">{mentorId}</td>
              <td className="border px-4 py-2">{mentees.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="bg-green-500 text-white px-4 py-2 mt-4"
        onClick={downloadCSV}
      >
        Download CSV
      </button>
    </div>
  );
};

export default MatchingResults;
