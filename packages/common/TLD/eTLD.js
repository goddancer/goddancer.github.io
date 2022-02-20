import COOKIE from 'js-cookie'

const getLastArrayItems = (arr, itemCount) => arr.slice(-itemCount);
// 'localhost' is a reserved top-level domain name
const eTLD = () => {
  if (!window.navigator.cookieEnabled) {
    throw new Error('Unable to detect apex domain without cookies enabled.');
  }
  let domain = '';

  const COOKIE_TOKEN = '__apex_test__';
  const hostname = window.location.hostname;
  const hostParts = hostname.toLowerCase().split('.');

  for (let i = 1; i < hostParts.length + 1; i++) {
    domain = getLastArrayItems(hostParts, i).join('.');
    COOKIE.set(COOKIE_TOKEN, COOKIE_TOKEN, {
      domain: `.${domain}`,
    });
    if (COOKIE.get(COOKIE_TOKEN)) {
      COOKIE.remove(COOKIE_TOKEN, {
        domain: `.${domain}`,
      });
      return domain;
    }
  }
};
export default eTLD;