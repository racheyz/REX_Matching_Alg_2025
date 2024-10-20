import React from 'react';

const MentorUpload = ({ setMentors }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const mentors = text.split('\n').map(line => line.split(','));
      setMentors(mentors);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Upload Mentors CSV</h2>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};

export default MentorUpload;
