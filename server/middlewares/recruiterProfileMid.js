const RecruiterProfile = require('../models/recruiterProfile');

// ─────────────────────────────────────────────────────────────
// Model fields (for reference / validation):
//   email, userName, img, company, position,
//   description, location, website, linkedIn,
//   jobsPosted (auto-synced), candidatesHired
// ─────────────────────────────────────────────────────────────

/** Parse multipart body into a plain object (handles JSON stringified values) */
const parseBody = (req) => {
  if (!req.file) return req.body;
  const body = {};
  Object.keys(req.body).forEach((key) => {
    try { body[key] = JSON.parse(req.body[key]); }
    catch { body[key] = req.body[key]; }
  });
  return body;
};

/**
 * Validate the writable recruiter profile fields.
 * Returns an error message string, or null if valid.
 */
const validateFields = (body) => {
  const { email, userName, company, position, description, location, website, linkedIn, candidatesHired, teamSize } = body;

  if (email !== undefined) {
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return 'email must be a valid email address';
  }

  if (userName !== undefined && typeof userName !== 'string')
    return 'userName must be a string';

  if (company !== undefined && typeof company !== 'string')
    return 'company must be a string';

  if (position !== undefined && typeof position !== 'string')
    return 'position must be a string';

  if (description !== undefined && typeof description !== 'string')
    return 'description must be a string';

  if (location !== undefined && typeof location !== 'string')
    return 'location must be a string';

  if (website !== undefined) {
    if (typeof website !== 'string')
      return 'website must be a string';
    try { new URL(website); } catch {
      return 'website must be a valid URL (e.g. https://example.com)';
    }
  }

  if (linkedIn !== undefined && typeof linkedIn !== 'string')
    return 'linkedIn must be a string';

  if (candidatesHired !== undefined) {
    const n = Number(candidatesHired);
    if (isNaN(n) || n < 0) return 'candidatesHired must be a non-negative number';
  }

  if (teamSize !== undefined) {
    const n = Number(teamSize);
    if (isNaN(n) || n < 0) return 'teamSize must be a non-negative number';
  }


  return null;
};

// ─────────────────────────────────────────────────────────────
// validateCreateRecruiterProfile
// Used on  POST /api/recruiter-profile
// – Checks 409 duplicate, validates body, parses multipart
// ─────────────────────────────────────────────────────────────
const validateCreateRecruiterProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    // Duplicate check
    const existing = await RecruiterProfile.findOne({ user: userId });
    if (existing)
      return res.status(409).json({ message: 'Profile already exists. Use PUT to update.' });

    // Parse body (multipart vs JSON)
    req.parsedBody = parseBody(req);

    const error = validateFields(req.parsedBody);
    if (error) return res.status(400).json({ message: error });

    next();
  } catch (err) {
    console.error('[RecruiterProfileMid] createProfile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────
// validateUpdateRecruiterProfile
// Used on  PUT /api/recruiter-profile
// – Checks profile exists (404), requires ≥1 valid field, validates
// ─────────────────────────────────────────────────────────────
const validateUpdateRecruiterProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    // Profile must already exist to update
    const existing = await RecruiterProfile.findOne({ user: userId });
    if (!existing)
      return res.status(404).json({ message: 'Profile not found. Use POST to create one first.' });

    // Parse body (multipart vs JSON)
    req.parsedBody = parseBody(req);

    // Disallow email updates on PUT (immutable)
    if (req.parsedBody.email !== undefined) {
      return res.status(400).json({ message: 'Cannot update email. This is an immutable field.' });
    }

    const {
      userName, company, position,
      description, location, website, linkedIn, candidatesHired, teamSize
    } = req.parsedBody;

    // Require at least one field (or a photo upload)
    const hasAtLeastOne =
      userName !== undefined ||
      company !== undefined ||
      position !== undefined ||
      description !== undefined ||
      location !== undefined ||
      website !== undefined ||
      linkedIn !== undefined ||
      candidatesHired !== undefined ||
      teamSize !== undefined ||
      req.file !== undefined;

    if (!hasAtLeastOne)
      return res.status(400).json({
        message: 'Provide at least one field to update: userName, company, position, description, location, website, linkedIn, candidatesHired, teamSize, or profilePhoto',
      });

    const error = validateFields(req.parsedBody);
    if (error) return res.status(400).json({ message: error });

    next();
  } catch (err) {
    console.error('[RecruiterProfileMid] updateProfile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { validateCreateRecruiterProfile, validateUpdateRecruiterProfile };
