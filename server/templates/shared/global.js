function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

function getMin(list, compare = (a, b) => a - b) {
  let min = list[0];
  for (let i = 1; i < list.length; i++) {
    if (compare(list[i], min) < 0) {
      min = list[i];
    }
  }
  return min;
}

function getMax(list, compare = (a, b) => a - b) {
  let max = list[0];
  for (let i = 1; i < list.length; i++) {
    if (compare(list[i], max) > 0) {
      max = list[i];
    }
  }
  return max;
}

function getMedian(list, compare = (a, b) => a - b) {
  const middle = Math.floor(list.length / 2);
  return list[middle];
}

function getAverage(list, compare = (a, b) => a - b) {
  let sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum += list[i];
  }
  return sum / list.length;
}

function getSum(list) {
  let sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum += list[i];
  }
  return sum;
}

export { getAverage, getMax, getMedian, getMin, getSum, groupBy };
