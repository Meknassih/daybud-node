const app = require('express').Router();
const controller = require('../controller/account');

const { Authorize, NordigenToken } = require('../../middleware/auth');
const { ROLES } = require('../../utils/constants');

app
  .route('/')
  /**
   * @api {get} /v1/accounts Get accounts
   * @apiDescription Get accounts
   * @apiVersion 1.0.0
   * @apiName Get accounts
   * @apiGroup Accounts
   * @apiPermission ACCOUNT
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess (Created 201) {String}  id         User's id
   * @apiSuccess (Created 201) {String}  name       User's name
   * @apiSuccess (Created 201) {String}  email      User's email
   * @apiSuccess (Created 201) {String}  role       User's role
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   * @apiError (Not Found 403)    Forbidden    Only admins or user with same id can access data
   */
  .get(Authorize(ROLES), NordigenToken, controller.getAll);

module.exports = app;
