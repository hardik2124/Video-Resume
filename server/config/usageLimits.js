// config/usageLimits.js

const usageLimits = {
  free: {
    scriptGeneration: 1,
    videoUpload: 0,
    interviewPractice: 0,
  },
  premium: {
    scriptGeneration: 999,
    videoUpload: 999,
    interviewPractice: 999,
  },
  admin: {
    scriptGeneration: Infinity,
    videoUpload: Infinity,
    interviewPractice: Infinity,
  }
};

export default usageLimits;
