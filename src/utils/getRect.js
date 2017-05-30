export const getRect = (elements) => {
  let rect 			 = elements.getBoundingClientRect(),
      clientTop  = document.documentElement.clientTop,
      clientLeft = document.documentElement.clientLeft;
  return {
    top: rect.top - clientTop,
    bottom: rect.bottom - clientTop,
    left: rect.left - clientLeft,
    right: rect.right - clientLeft
  };
};
