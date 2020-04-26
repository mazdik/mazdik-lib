module.exports = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '@mazdik-lib/(.+)$': '<rootDir>packages/$1/src',
  }
};
