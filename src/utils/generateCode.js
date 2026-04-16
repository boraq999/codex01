const pad = (value) => String(value).padStart(3, "0");

const generateCode = (prefix, sequence) => {
  const now = new Date();
  const period = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  return `${prefix}-${period}-${pad(sequence)}`;
};

module.exports = generateCode;

