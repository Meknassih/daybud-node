const { GetAccount } = require('../service/account');
const { CreateRequisition, GetRequisition } = require('../service/requisition');

/**
 * Get accounts
 * @public
 */
exports.getAll = async (req, res, next) => {
  try {
    console.log('entered getAll', req.nordigenToken);
    const { nordigenToken } = req;
    const { user } = req;
    const requisitionCreated = await CreateRequisition(nordigenToken);
    console.log('requisition created', requisitionCreated);
    const requisition = await GetRequisition(
      nordigenToken,
      requisitionCreated.id
    );
    console.log('requisition', requisition);
    const response = await GetAccount(nordigenToken, requisition.accounts[0]);
    return res.json({ data: response, success: 'SUCCESS' });
  } catch (error) {
    console.error(error.response);
    return next(error);
  }
};
