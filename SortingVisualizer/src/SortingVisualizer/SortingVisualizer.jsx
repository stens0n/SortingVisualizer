import React from 'react';
import { getMergeSortAnimations, getQuickSortAnimations } from '../sortingAlgorithms/sortingAlgorithms.js';
import './SortingVisualizer.css';

const ANIMATION_SPEED_MS = 1;
const NUMBER_OF_ARRAY_BARS = 250;
const PRIMARY_COLOR = 'turquoise';
const SECONDARY_COLOR = 'red';

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);

    // Determine the number of bars and bar width based on screen width
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 768; // Assume mobile if screen width is 768px or less
    const numberOfArrayBars = isMobile ? 50 : 100;
    const barWidth = screenWidth / numberOfArrayBars;

    this.state = {
      array: [],
      numberOfArrayBars,
      barWidth,
    };

    // Bind the updateBars method to 'this'
    this.updateBars = this.updateBars.bind(this);
  }

  componentDidMount() {
    this.resetArray();
    // Add a window resize event listener to update the bars when the screen size changes
    window.addEventListener('resize', this.updateBars);
  }

  componentWillUnmount() {
    // Remove the event listener to prevent memory leaks
    window.removeEventListener('resize', this.updateBars);
  }

  updateBars() {
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 768;
    const numberOfArrayBars = isMobile ? 20 : 100;
    const barWidth = screenWidth / numberOfArrayBars;
    this.setState({ numberOfArrayBars, barWidth });
  }

  resetArray() {
    const array = [];
    for (let i = 0; i < this.state.numberOfArrayBars; i++) {
      array.push(randomIntFromInterval(5, 730));
    }
    this.setState({ array });
  }

  mergeSort() {
    const animations = getMergeSortAnimations(this.state.array);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * ANIMATION_SPEED_MS);
      }
    }
  }

  async quickSort() {
    const animations = getQuickSortAnimations(this.state.array);
    for (const animation of animations) {
      await this.handleAnimation(animation);
    }
    this.resetBarColors();
  }

  resetBarColors() {
    const arrayBars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < arrayBars.length; i++) {
      arrayBars[i].style.backgroundColor = PRIMARY_COLOR;
    }
  }

  async handleAnimation(animation) {
    const { type, values } = animation;
    const arrayBars = document.getElementsByClassName('array-bar');

    return new Promise(resolve => {
      setTimeout(() => {
        if (type === 'colorChange') {
          const [barOneIdx, barTwoIdx, color] = values;
          arrayBars[barOneIdx].style.backgroundColor = color;
          arrayBars[barTwoIdx].style.backgroundColor = color;
        } else if (type === 'heightUpdate') {
          const [barOneIdx, newHeight, barTwoIdx, newHeight2] = values;
          arrayBars[barOneIdx].style.height = `${newHeight}px`;
          if (barTwoIdx !== undefined) {
            arrayBars[barTwoIdx].style.height = `${newHeight2}px`;
          }
        }
        resolve();
      }, ANIMATION_SPEED_MS);
    });
  }

  heapSort() {
    // Figure it out later 
  }

  bubbleSort() {
    // Figure it out later
  }

  // This method will only work if your sorting algorithms actually return
  // the sorted arrays; if they return the animations (as they currently do), then
  // this method will be broken.
  testSortingAlgorithms() {
    for (let i = 0; i < 100; i++) {
      const array = [];
      const length = randomIntFromInterval(1, 1000);
      for (let i = 0; i < length; i++) {
        array.push(randomIntFromInterval(-1000, 1000));
      }
      const javaScriptSortedArray = array.slice().sort((a, b) => a - b);
      const mergeSortedArray = getMergeSortAnimations(array.slice());
      console.log(arraysAreEqual(javaScriptSortedArray, mergeSortedArray));
    }
  }

  render() {
    const { array, barWidth } = this.state;

    return (
      <div className="visualizer-container">
        <div className="array-container">
          {array.map((value, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{
                backgroundColor: PRIMARY_COLOR,
                height: `${value}px`,
                width: `${barWidth}px`,  // Set the width of each bar based on state
              }}></div>
                ))}
            </div>
            <div className="buttons-container">
                <button onClick={() => this.resetArray()}
                        onTouchEnd={() => this.resetArray()}>Generate New Array</button>
                <button onClick={() => this.mergeSort()}>Merge Sort</button>
                <button onClick={() => this.quickSort()}>Quick Sort</button>
                <button onClick={() => this.heapSort()}>Heap Sort (coming soon)</button>
                <button onClick={() => this.bubbleSort()}>Bubble Sort (coming soon)</button>
                <button onClick={() => this.testSortingAlgorithms()}>
                    Test Sorting Algorithms (BROKEN)
                </button>
            </div>
        </div>
    );
}}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function arraysAreEqual(arrayOne, arrayTwo) {
  if (arrayOne.length !== arrayTwo.length) return false;
  for (let i = 0; i < arrayOne.length; i++) {
    if (arrayOne[i] !== arrayTwo[i]) {
      return false;
    }
  }
  return true;
}

