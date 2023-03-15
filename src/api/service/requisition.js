const { default: axios } = require('axios');
const { nordigen, host } = require('../../config/env-vars');

/**
 * Create a requisition
 * @public
 *
 * @param {String} accessToken access token
 *
 * @returns {Promise<RequisitionCreation>} Created Requistion Object
 */
exports.CreateRequisition = async (accessToken) => {
  const response = await axios({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    url: `${nordigen.baseUrl}requisitions/`,
    data: {
      redirect: `${host}/nordigen/callback`,
      institution_id: 'BOURSORAMA_BOUSFRPP',
    },
  });
  return response.data;
};

exports.GetRequisition = async (accessToken, id) => {
  const response = await axios({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    url: `${nordigen.baseUrl}requisitions/${id}`,
  });
  return response.data;
};

/**
 *  @typedef RequisitionCreation
 *  @property {string} id
 *  @property {Date} created
 *  @property {string} redirect
 *  @property {string} status
 *  @property {string} institution_id
 *  @property {string} agreement
 *  @property {string} reference
 *  @property {string[]} accounts
 *  @property {string} link
 *  @property {any} ssn
 *  @property {boolean} account_selection
 *  @property {boolean} redirect_immediate
 */
