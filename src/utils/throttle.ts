export const throttle = <A extends any[]>(
  func: (...args: A) => void,
  delay: number
): ((...args: A) => void) => {
  let lastCall = 0;

  return function (...args: A) {
    const now = Date.now();

    if (now - lastCall < delay) {
      return;
    }

    lastCall = now;
    func(...args);
  };
};
