const generateMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime(),
  };
};

const generateLocation = (loc) => {
  return {
    text:loc,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocation
};
