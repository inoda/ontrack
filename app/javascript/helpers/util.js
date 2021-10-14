const Util = {
  debounce(func, wait) {
    return function() {
      const context = this;
      const args = arguments;
      let timeout;

      clearTimeout(timeout);
      timeout = setTimeout(function() {
        timeout = null;
        func.apply(context, args);
      }, wait);
    };
  },
};

export default Util;
