import moment from "moment";

const Numerics = {
  centsToDollars(value) {
    if (value == null || value == undefined) return '';

    try {
      return '$' + ((value / 100).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    } catch(error) {
      console.error(value, error);
      return value.toString();
    }
  },

  commify(value) {
    if (value == null || value == undefined) return ''
    // This accounts for more than 3 digits after a decimal. We don't want commas there.
    let parts = value.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  },

  timestamp(value) {
    if (value == null || value == undefined) return '';

    try {
      return moment(value).format("MM/DD/YYYY")
    } catch(error) {
      console.error(value, error);
      return value.toString();
    }
  },
}

export default Numerics;
