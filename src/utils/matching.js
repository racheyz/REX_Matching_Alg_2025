export const processMatching = (mentees, mentors) => {
    const mentorCapacity = {}; // mentorId -> capacity
    const menteePreferences = {}; // menteeId -> pref array
    const mentorPreferences = {}; // mentorId -> pref array
    const mentorAssignments = {}; // mentorId -> list of mentees assigned to that mentor
    const menteeAssigned = {}; // menteeId -> mentor currently assigned 
    const mentorProposal = {}; // mentorId -> index of next mentee in pref list to propose to 
    const freeMentors = []; // list of mentors with unfilled capacity

    // console.log(mentors);
    // console.log(mentees);
  
    // initialize mentor preference list, capacity list, proposal list, and assignment list
    mentors.forEach(([mentorId, capacity, ...prefs]) => {
      
      mentorCapacity[mentorId.trim()] = parseInt(capacity);
      mentorPreferences[mentorId.trim()] = prefs.map(p => p && p.trim()).filter(p => mentees.some(m => m[0].trim() === p));
      mentorAssignments[mentorId.trim()] = [];
      mentorProposal[mentorId.trim()] = 0;
      if (mentorCapacity[mentorId.trim()] > 0) {
        freeMentors.push(mentorId.trim());
      }
    });
  
    // intiialize mentee preference list
    mentees.forEach(([menteeId, ...prefs]) => {
      menteePreferences[menteeId.trim()] = prefs.map(p => p && p.trim()).filter(p => mentors.some(m => m[0].trim() === p));
      menteeAssigned[menteeId.trim()] = null;
    });


    // console.log(mentorCapacity);
    // console.log(mentorPreferences);
    // console.log(freeMentors);
    // console.log(menteePreferences);
    // console.log(menteeAssigned);


    // Resident Matching algorithm (with mentors being the proposing side)
    while (freeMentors.length > 0) {                                         
        const mentorId = freeMentors.shift();


        while (mentorProposal[mentorId] < mentorPreferences[mentorId].length && mentorAssignments[mentorId].length < mentorCapacity[mentorId]) {
              const menteeId = mentorPreferences[mentorId][mentorProposal[mentorId]];
              mentorProposal[mentorId]++;

              const currentMentor = menteeAssigned[menteeId];

              if (currentMentor === null) {
                // mentee has not been assigned to any other mentor

                
                if (menteePreferences[menteeId].includes(mentorId)){
                  // mentor in mentee's pref list
                  
                  menteeAssigned[menteeId] = mentorId;
                  mentorAssignments[mentorId].push(menteeId);
                }

              } else {
                // mentee is currently assigned to another mentor
                const menteePrefList = menteePreferences[menteeId];
                const prefersNewMentor = menteePrefList.includes(mentorId)&& (menteePrefList.indexOf(mentorId) < menteePrefList.indexOf(currentMentor));  

                if (prefersNewMentor) {
                  // switch over to new mentor

                  mentorAssignments[currentMentor] = mentorAssignments[currentMentor].filter(m => m !== menteeId); // remove mentee from old mentor's assignment list
                  mentorAssignments[mentorId].push(menteeId);
                  menteeAssigned[menteeId] = mentorId;

                  // Re-add the displaced mentor to freeMentors if they have capacity again
                  if (mentorAssignments[currentMentor].length < mentorCapacity[currentMentor]) {
                    freeMentors.push(currentMentor);
                  }
                }

              }
            }

            if (
              mentorAssignments[mentorId].length < mentorCapacity[mentorId] &&
              mentorProposal[mentorId] < mentorPreferences[mentorId].length
            ) {
              freeMentors.push(mentorId);
            }
    }


    // CHECK: all assigned mentee and mentor mutually chose one another at this point (passed)
    for (const [mentor, mentees] of Object.entries(mentorAssignments)) {
      for (const mentee of mentees) {
        if (!menteePreferences[mentee].includes(mentor) || !mentorPreferences[mentor].includes(mentee)){
          console.log(`${mentee} and ${mentor} not mutual preference`);
        }
      }
    }

    const unmatchedMentees = [];
    const availableMentors = {}; 

    // get a list of all mentors with remaining capacity
    mentors.forEach(([mentorId, capacity, ...prefs]) => {
      if (mentorCapacity[mentorId] > mentorAssignments[mentorId].length) {
        availableMentors[mentorId] = [];
        availableMentors[mentorId].push(mentorCapacity[mentorId] - mentorAssignments[mentorId].length);
      }
    });

    // get all unmatched mentees 
    for (const [mentee, mentor] of Object.entries(menteeAssigned)) {
        if (mentor === null) {
          unmatchedMentees.push(mentee);
        }
    }

    // for every available mentor, get the unmatched mentees who included that mentor in their preference list.
    for (const mentor of Object.keys(availableMentors)) {
      for (const mentee of unmatchedMentees) {
        if (menteePreferences[mentee].includes(mentor)) {
          availableMentors[mentor].push(mentee);
        }
      }
    }

    const availableMentorsWithMentees = {};
    // keep only the available mentors who has been included by a mentee in their preference list
    for (const [mentor, data] of Object.entries(availableMentors)) {
        if (data.length > 1) {
          availableMentorsWithMentees[mentor] = data;
        }
    }

    // CHECK: no mentee is assigned to more than 1 mentor (passed)
    const allAssignedMentees = [];

    Object.values(mentorAssignments).forEach(mentees => {
      allAssignedMentees.push(...mentees);
    });

    mentees.forEach(([menteeId, ...prefs]) => {
      const count = allAssignedMentees.filter(id => id === menteeId).length;
        if (count > 1) {
          console.log(`${menteeId} is assigned multiple times`);
        } 
    });

    // CHECK: no mentor is assigned past its capacity (passed)
    for (const [mentor, mentees] of Object.entries(mentorAssignments)) {
      if (mentees.length > mentorCapacity[mentor]) {
        console.log(`${mentor} is assigned mentees past its capacity`) 
      }
    }

    // console.log(availableMentors);
    // console.log(mentorAssignments);

    return { mentorAssignments, availableMentorsWithMentees };
  };
  
