export const add = (element, className) => {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.setAttribute('class', element.getAttribute('class') + ' ' + className);
  }
};

export const remove = (element, className) => {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    element.setAttribute('class', element.getAttribute('class').replace(
      new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
    );
  }
};

export const has = (element, className) => {
  if (element.classList) {
    return element.classList.has(className);
  } else {
    return (element.getAttribute('class').indexOf(className) != -1);
  }
};

export const toggle = (element, className) => {
  if (element.classList && element.classList.toggle) {
    element.classList.toggle(className);
  } else {
    if (has(element, className)) {
      remove(element. className);
    } else {
      add(element, className);
    }
  }
};

export const classifier = {
  add,
  remove,
  has,
  toggle
};

export default classifier;
