import React from 'react';
import { saveAs } from 'file-saver';

const MatchingResults = ({ results, availableMentorsWithMentees }) => {
  const downloadResultsCSV = () => {
    const headers = 'mentor_id,mentees\n';
    const rows = Object.entries(results)
      .map(([mentorId, mentees]) => `${mentorId},${mentees.join(',')}`)
      .join('\n');
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'results.csv');
  };

  const downloadRemainingMentorsCSV = () => {
    const headers = 'mentor_id,capacity,mentees\n';
    const rows = Object.entries(availableMentorsWithMentees)
      .map(([mentorId, data]) => {
      const [capacity, ...mentees] = data;
      return `${mentorId},${capacity},"${mentees.join(',')}"`;
    }).join('\n');
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'remainingMentorMentee.csv');
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
        onClick={downloadResultsCSV}
      >
        Download CSV
      </button>



      <h2 className="text-xl font-bold mt-8">Mentors with remaining capacity and unmatched interested mentees</h2>
      <table className="table-auto w-full mt-2">
        <thead>
          <tr>
            <th className="border px-4 py-2">Mentor ID</th>
            <th className="border px-4 py-2">Remaining Capacity</th>
            <th className="border px-4 py-2">Unmatched mentees that chose this mentor</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(availableMentorsWithMentees).map(([mentorId, data]) => {
            const [capacity, ...mentees] = data;
            return(
            <tr key={mentorId}>
              <td className="border px-4 py-2">{mentorId}</td>
              <td className="border px-4 py-2">{capacity}</td>
              <td className="border px-4 py-2">{mentees.join(', ')}</td>
            </tr>)
            })}
        </tbody>
      </table>
      <button
        className="bg-green-500 text-white px-4 py-2 mt-4"
        onClick={downloadRemainingMentorsCSV}
      >
        Download CSV
      </button>



      
    </div>
  );
};

export default MatchingResults;
