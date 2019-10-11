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
