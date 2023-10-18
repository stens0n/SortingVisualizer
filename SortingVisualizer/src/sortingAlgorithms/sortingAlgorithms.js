export function getMergeSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return array;
  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
  return animations;
}

function mergeSortHelper(
  mainArray,
  startIdx,
  endIdx,
  auxiliaryArray,
  animations,
) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(
  mainArray,
  startIdx,
  middleIdx,
  endIdx,
  auxiliaryArray,
  animations,
) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    // These are the values that we're comparing; we push them once
    // to change their color.
    animations.push([i, j]);
    // These are the values that we're comparing; we push them a second
    // time to revert their color.
    animations.push([i, j]);
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      // We overwrite the value at index k in the original array with the
      // value at index i in the auxiliary array.
      animations.push([k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      // We overwrite the value at index k in the original array with the
      // value at index j in the auxiliary array.
      animations.push([k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  while (i <= middleIdx) {
    // These are the values that we're comparing; we push them once
    // to change their color.
    animations.push([i, i]);
    // These are the values that we're comparing; we push them a second
    // time to revert their color.
    animations.push([i, i]);
    // We overwrite the value at index k in the original array with the
    // value at index i in the auxiliary array.
    animations.push([k, auxiliaryArray[i]]);
    mainArray[k++] = auxiliaryArray[i++];
  }
  while (j <= endIdx) {
    // These are the values that we're comparing; we push them once
    // to change their color.
    animations.push([j, j]);
    // These are the values that we're comparing; we push them a second
    // time to revert their color.
    animations.push([j, j]);
    // We overwrite the value at index k in the original array with the
    // value at index j in the auxiliary array.
    animations.push([k, auxiliaryArray[j]]);
    mainArray[k++] = auxiliaryArray[j++];
  }
}


// Quick Sort
export function getQuickSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;
  quickSortHelper(array, 0, array.length - 1, animations);
  return animations;
}

function swap(mainArray, i, j) {
  const temp = mainArray[i];
  mainArray[i] = mainArray[j];
  mainArray[j] = temp;
}

function quickSortHelper(mainArray, startIdx, endIdx, animations) {
  if (startIdx >= endIdx) return;
  let pivotIdx = partition(mainArray, startIdx, endIdx, animations);
  quickSortHelper(mainArray, startIdx, pivotIdx - 1, animations);
  quickSortHelper(mainArray, pivotIdx + 1, endIdx, animations);

}

function partition(mainArray, startIdx, endIdx, animations) {
  let pivotIdx = startIdx;
  let pivotValue = mainArray[pivotIdx];
  let leftIdx = startIdx + 1;
  let rightIdx = endIdx;
  animations.push({type: 'colorChange', values: [pivotIdx, pivotIdx, 'red']});
  while (rightIdx >= leftIdx) {
    // Highlight the bars being compared in red
    animations.push({type: 'colorChange', values: [leftIdx, rightIdx, 'red']});
    if (mainArray[leftIdx] > pivotValue && mainArray[rightIdx] < pivotValue) {
      animations.push({type: 'heightUpdate', values: [leftIdx, mainArray[rightIdx], rightIdx, mainArray[leftIdx]]});
      swap(mainArray, leftIdx, rightIdx);
    }
    // Revert the color of the bars being compared before moving to the next comparison
    animations.push({type: 'colorChange', values: [leftIdx, rightIdx, 'turquoise']});
    if (mainArray[leftIdx] <= pivotValue) leftIdx++;
    if (mainArray[rightIdx] >= pivotValue) rightIdx--;
  }
  animations.push({type: 'colorChange', values: [pivotIdx, rightIdx, 'turquoise']});  // revert color of the pivot and rightIdx
  animations.push({type: 'heightUpdate', values: [pivotIdx, mainArray[rightIdx], rightIdx, mainArray[pivotIdx]]});
  swap(mainArray, pivotIdx, rightIdx);
  return rightIdx;
}