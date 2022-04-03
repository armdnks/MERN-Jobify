import { UnAuthenticatedError } from '../errors/index.js';

const checkPermissions = (userId, jobCreatedBy) => {
  if (userId === jobCreatedBy.toString()) return;

  throw new UnAuthenticatedError('Not Authorized To Access This Route');
};

export default checkPermissions;
