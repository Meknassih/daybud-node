const { default: axios } = require('axios');
const { nordigen } = require('../../config/env-vars');
const APIError = require('../../utils/APIError');
const { BAD_GATEWAY } = require('../../utils/constants');

exports.refreshToken = async (req, refreshToken) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  };
  const response = await fetch(`${nordigen.baseUrl}token/refresh`, options);
  const data = await response.json();
  if (response.status !== 200) {
    throw new APIError({
      message: 'Nordigen token request failed',
      status: BAD_GATEWAY,
      errors: [data],
    });
  }
  req.nordigenToken = data.access;
};

exports.getNewToken = async (req) => {
  const response = await axios({
    method: 'POST',
    url: `${nordigen.baseUrl}token/new/`,
    data: {
      secret_id: nordigen.id,
      secret_key: nordigen.key,
    },
  });
  if (response.status !== 200) {
    throw new APIError({
      message: 'Nordigen token request failed',
      status: BAD_GATEWAY,
      errors: [response],
    });
  }
  req.nordigenToken = response.data.access;
};
