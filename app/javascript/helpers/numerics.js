import moment from 'moment';

const Numerics = {
  centsToDollars(value) {
    if (value == null || value == undefined) { return ''; }

    try {
      return '$' + ((value / 100).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(value, error);
      return value.toString();
    }
  },

  centsToFloat(value) {
    if (value == null || value == undefined) { return 0; }

    try {
      return (value / 100).toFixed(2);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(value, error);
      return value;
    }
  },

  floatToPercent(value) {
    if (value == null || value == undefined) { return 0; }

    try {
      return (value * 100).toFixed(2);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(value, error);
      return value;
    }
  },

  commify(value) {
    if (value == null || value == undefined) { return ''; }
    // This accounts for more than 3 digits after a decimal. We don't want commas there.
    const parts = value.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  },

  timestamp(value) {
    if (value == null || value == undefined) { return ''; }

    try {
      return moment(value).format('MM/DD/YYYY');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(value, error);
      return value.toString();
    }
  },
};

export default Numerics;
