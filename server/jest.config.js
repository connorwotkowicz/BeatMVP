
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  extensionsToTreatAsEsm: ['.js', '.jsx'],
  transformIgnorePatterns: ['/node_modules/'],
};
