const { default: axios } = require('axios');
const { nordigen } = require('../../config/env-vars');

/**
 * Get account with full info
 * @public
 *
 * @param {String} accountId account id
 *
 * @returns {Promise<Account>} Aggregated Account Object
 */
exports.GetAccount = async (accessToken, accountId) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  };
  const accountResponse = await axios({
    ...options,
    url: `${nordigen.baseUrl}accounts/${accountId}/details`,
  });
  const transactionsResponse = await axios({
    ...options,
    url: `${nordigen.baseUrl}accounts/${accountId}/transactions`,
  });
  const balancesResponse = await axios({
    ...options,
    url: `${nordigen.baseUrl}accounts/${accountId}/balances`,
  });

  const { account } = accountResponse.data;
  account.transactions = transactionsResponse.data.transactions;
  account.balances = balancesResponse.data.balances;

  return account;
};

/**
 * @typedef Account
 * @property {string} resourceId
 * @property {string} iban
 * @property {string} currency
 * @property {string} name
 * @property {string} product
 * @property {string} cashAccountType
 * @property {string} status
 * @property {string} bic
 * @property {string} usage
 * @property {Array} balances
 * @property {Object} transactions
 * @property {Array} transactions.booked
 * @property {Array} transactions.pending
 */
