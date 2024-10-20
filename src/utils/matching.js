export const processMatching = (mentees, mentors) => {
    const mentorCapacity = {};
    const menteePreferences = {};
    const mentorPreferences = {};
    const mutualMatches = [];
    const mentorAssignments = {};
    const menteeAssigned = new Set();
  
    mentors.forEach(([mentorId, capacity, ...prefs]) => {
      mentorCapacity[mentorId] = parseInt(capacity);
      mentorPreferences[mentorId] = prefs.filter(p => p);
    });
  
    mentees.forEach(([menteeId, ...prefs]) => {
      menteePreferences[menteeId] = prefs.filter(p => mentors.some(m => m[0] === p));
    });
  
    // Collect mutual preferences
    for (let mentee in menteePreferences) {
      for (let mentor of menteePreferences[mentee]) {
        if (mentorPreferences[mentor] && mentorPreferences[mentor].includes(mentee)) {
          mutualMatches.push([mentee, mentor]);
        }
      }
    }
  
    // Assign mutual preferences first
    mutualMatches.forEach(([mentee, mentor]) => {
      if (!mentorAssignments[mentor]) {
        mentorAssignments[mentor] = [];
      }
  
      if (mentorAssignments[mentor].length < mentorCapacity[mentor] && !menteeAssigned.has(mentee)) {
        mentorAssignments[mentor].push(mentee);
        menteeAssigned.add(mentee);
      } else {
        const leastPreferred = mentorAssignments[mentor].findIndex(m => 
          mentorPreferences[mentor].indexOf(m) > mentorPreferences[mentor].indexOf(mentee)
        );
  
        if (leastPreferred !== -1 && !menteeAssigned.has(mentee)) {
          menteeAssigned.delete(mentorAssignments[mentor][leastPreferred]);
          mentorAssignments[mentor][leastPreferred] = mentee;
          menteeAssigned.add(mentee);
        }
      }
    });
  
    // Remove already matched mentees
    mutualMatches.forEach(([mentee, mentor]) => {
      delete menteePreferences[mentee];
      mentorPreferences[mentor] = mentorPreferences[mentor].filter(id => id !== mentee);
    });
  
    const menteeProposals = {};
  
    Object.keys(menteePreferences).forEach(mentee => {
      menteeProposals[mentee] = 0;
    });
  
    let freeMentees = Object.keys(menteePreferences);
  
    while (freeMentees.length > 0) {
      const mentee = freeMentees.shift();
      const preferences = menteePreferences[mentee];
      const proposalIndex = menteeProposals[mentee];
      const mentor = preferences[proposalIndex];
  
      if (!mentorAssignments[mentor]) {
        mentorAssignments[mentor] = [];
      }
  
      if (mentorAssignments[mentor].length < mentorCapacity[mentor] && !menteeAssigned.has(mentee)) {
        mentorAssignments[mentor].push(mentee);
        menteeAssigned.add(mentee);
      } else {
        const leastPreferred = mentorAssignments[mentor].findIndex(m => 
          mentorPreferences[mentor].indexOf(m) > mentorPreferences[mentor].indexOf(mentee)
        );
  
        if (leastPreferred !== -1 && !menteeAssigned.has(mentee)) {
          menteeAssigned.delete(mentorAssignments[mentor][leastPreferred]);
          mentorAssignments[mentor][leastPreferred] = mentee;
          menteeAssigned.add(mentee);
        } else {
          menteeProposals[mentee]++;
          if (menteeProposals[mentee] < preferences.length) {
            freeMentees.push(mentee);
          }
        }
      }
    }
  
    return mentorAssignments;
  };
  