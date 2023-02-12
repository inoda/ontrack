import Util from './util';

const Numerics = {
  currency(value) {
    if (value == null) { return ''; }

    value = value/100;
    return value.toLocaleString(
      Util.getCookie('locale'),
      { style: 'currency', currency: Util.getCookie('currency_iso') });
  },

  floatToPercent(value) {
    if (value == null) { return 0; }

    try {
      return (value * 100).toFixed(2);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(value, error);
      return value;
    }
  },
};

export default Numerics;
