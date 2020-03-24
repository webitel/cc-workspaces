const debounce = (method, delay = 1000) => {
  let timer;
  return (args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      method(args);
    }, delay);
  };
};

export default debounce;
