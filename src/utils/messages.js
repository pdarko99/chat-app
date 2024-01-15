const generateMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime(),
  };
};

const generateLocation = (loc, username) => {
  return {
    username,
    text: loc,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocation,
};
