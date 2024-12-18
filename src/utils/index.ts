export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
import moment from "moment";

export const formatErrorMessage = (error: any): string => {
  return (
    error?.response?.extras?.reason ||
    error?.response?.data?.message ||
    error?.response?.data ||
    error?.message
  );
};

export const formatAmount = (
  value: any,
  digits?: number,
  minDigits?: number
) => {
  const maxDigits = Math.min(Math.max(digits ?? 2, 0), 7); // Ensure digits are within 0-20
  const minFractionDigits = Math.min(Math.max(minDigits ?? 2, 0), maxDigits); // minDigits should not exceed maxDigits

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxDigits,
  }).format(value);
};

export const formatDate = (value: string, format: string = "MMMM Do, YYYY") => {
  return moment(value).format(format);
};

export const compareObjects = (x: any, y: any) => {
  if (x == y) return true;
  // if both x and y are null or undefined and exactly the same

  if (!(x instanceof Object) || !(y instanceof Object)) return false;
  // if they are not strictly equal, they both need to be Objects

  if (x.constructor !== y.constructor) return false;
  // they must have the exact same prototype chain, the closest we can do is
  // test there constructor.

  for (let p in x) {
    if (!x.hasOwnProperty(p)) continue;
    // other properties were tested using x.constructor === y.constructor

    if (!y.hasOwnProperty(p)) return false;
    // allows to compare x[ p ] and y[ p ] when set to undefined

    if (x[p] == y[p]) continue;
    // if they have the same strict value or identity then they are equal

    if (typeof x[p] !== "object") return false;
    // Numbers, Strings, Functions, Booleans must be strictly equal

    if (!compareObjects(x[p], y[p])) return false;
    // Objects and Arrays must be tested recursively
  }

  for (let p in y)
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
  // allows x[ p ] to be set to undefined

  return true;
};

export const removeDuplicates = (arr: any[], key: string) => {
  const seen = new Set();
  return arr.reduce((acc, current) => {
    if (!seen.has(current[key])) {
      seen.add(current[key]);
      acc.push(current);
    }
    return acc;
  }, []);
};
