export const Regex = {
  phone: {
    phone: /^(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}$/,
    removeCountryCode: /^\s*(?:\+|00)?\d{1,3}\s*/
  },
  numeric: /[^0-9]/g
};
