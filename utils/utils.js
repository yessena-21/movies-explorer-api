// const linkRegExp = /^(http|https):\/\/(www.)?
// [\w\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+\.[\w\/]+#?/;
const linkRegExp = /^(https?:\/\/)([\da-z.-]{1,})(\.)([a-z]{2,6})(\/?)([\da-z-.\W]*)/;

module.exports = {
  linkRegExp,
};
