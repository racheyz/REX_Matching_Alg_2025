import React from 'react';

const MenteeUpload = ({ setMentees }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const mentees = text.split('\n').map(line => line.split(','));
      setMentees(mentees);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Upload Mentees CSV</h2>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};

export default MenteeUpload;
