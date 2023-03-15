const passport = require('passport');
const moment = require('moment');
const {
  ROLES,
  UNAUTHORIZED,
  LOGGED_IN,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constants');
const APIError = require('../utils/APIError');
const { getNewToken, refreshToken } = require('../api/service/nordigenAuth');
const { ErrorHandler } = require('./error');

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  const error = err || info;

  const apiError = new APIError({
    message: error ? error.message : 'Unauthorized',
    status: UNAUTHORIZED,
    stack: error ? error.stack : undefined,
  });
  if (err || !user) {
    return next(apiError);
  }
  if (roles === LOGGED_IN) {
    if (user.role !== 'admin' && req.params.userId !== user._id.toString()) {
      apiError.status = FORBIDDEN;
      apiError.message = 'Forbidden';
      return next(apiError);
    }
  } else if (!roles.includes(user.role)) {
    apiError.status = FORBIDDEN;
    apiError.message = 'Forbidden';
    return next(apiError);
  }

  req.user = user;

  return next();
};

exports.Authorize =
  (roles = ROLES) =>
  (req, res, next) =>
    passport.authenticate(
      'jwt',
      { session: false },
      handleJWT(req, res, next, roles)
    )(req, res, next);

exports.NordigenToken = async (req, res, next) => {
  const { user } = req;
  if (!user) {
    throw new APIError({
      message: 'ensureNordigenCredentials was called without user',
      status: INTERNAL_SERVER_ERROR,
    });
  }
  try {
    if (!user.nordigen.tokens.access) {
      // No access token
      await getNewToken(req);
    } else if (
      moment().isAfter(
        moment(user.nordigen.tokens.createdAt).add(
          user.nordigen.tokens.access_expires,
          'seconds'
        )
      )
    ) {
      // Access expired
      if (
        user.nordigen.tokens.refresh &&
        moment().isBefore(
          moment(user.nordigen.tokens.createdAt).add(
            user.nordigen.tokens.refresh_expires,
            'seconds'
          )
        )
      ) {
        // Can refresh
        await refreshToken(req, user.nordigen.tokens.refresh);
      } else {
        // Refresh expired
        await getNewToken(req);
      }
    }
    return next();
  } catch (error) {
    ErrorHandler(error, req, res, next);
  }
};
