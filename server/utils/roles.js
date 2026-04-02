const ROLES = Object.freeze({
  ADMIN: "admin",
  RECRUITER: "recruiter",
  CANDIDATE: "candidate",
  USER: "user",
});

const USER_FACING_ROLES = Object.freeze([ROLES.CANDIDATE, ROLES.USER]);

module.exports = {
  ROLES,
  USER_FACING_ROLES,
};