const axios = require("axios");

module.exports.getQuestion = async function () {
  try {
    const serviceRes = await axios.get(
      `${process.env.API_ENDPOINT}/api/quiz/getQuestion`
    );
    return serviceRes.data;
  } catch (e) {
    throw new Error(e);
  }
};
