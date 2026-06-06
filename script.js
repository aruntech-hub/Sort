// ==========================
// ELEMENTS
// ==========================

const inputArray = document.getElementById("inputArray");

const generateBtn = document.getElementById("generateBtn");
const bubbleBtn = document.getElementById("bubbleBtn");
const mergeBtn = document.getElementById("mergeBtn");
const resetBtn = document.getElementById("resetBtn");
const themeToggle = document.getElementById("themeToggle");

const bubbleContainer = document.getElementById("bubbleContainer");
const mergeContainer = document.getElementById("mergeContainer");

const comparisonCount = document.getElementById("comparisonCount");
const swapCount = document.getElementById("swapCount");
const executionTime = document.getElementById("executionTime");
const arraySize = document.getElementById("arraySize");

const bubbleResult = document.getElementById("bubbleResult");
const mergeResult = document.getElementById("mergeResult");

// ==========================
// GLOBALS
// ==========================

let currentArray = [];
let comparisons = 0;
let swaps = 0;

// ==========================
// HELPERS
// ==========================

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ==========================
// CREATE RANDOM ARRAY
// ==========================

function generateRandomArray(size = 20) {
    currentArray = [];

    for (let i = 0; i < size; i++) {
        currentArray.push(randomNumber(20, 250));
    }

    inputArray.value = currentArray.join(",");
    renderBars(currentArray, bubbleContainer);
    renderBars(currentArray, mergeContainer);

    arraySize.textContent = currentArray.length;
}

// ==========================
// RENDER BARS
// ==========================

function renderBars(arr, container) {

    container.innerHTML = "";

    arr.forEach(value => {

        const bar = document.createElement("div");

        bar.classList.add("bar");

        bar.style.height = `${value}px`;

        container.appendChild(bar);
    });
}

// ==========================
// GET ARRAY
// ==========================

function getInputArray() {

    const value = inputArray.value.trim();

    if (!value) {
        alert("Please enter numbers.");
        return null;
    }

    const arr = value
        .split(",")
        .map(item => Number(item.trim()));

    if (arr.some(isNaN)) {
        alert("Invalid input.");
        return null;
    }

    return arr;
}

// ==========================
// RESET STATS
// ==========================

function resetStats() {

    comparisons = 0;
    swaps = 0;

    comparisonCount.textContent = 0;
    swapCount.textContent = 0;
    executionTime.textContent = "0 ms";
}

// ==========================
// UPDATE STATS
// ==========================

function updateStats() {

    comparisonCount.textContent = comparisons;
    swapCount.textContent = swaps;
}

// ==========================
// BUBBLE SORT VISUALIZATION
// ==========================

async function visualizeBubbleSort() {

    const arr = getInputArray();

    if (!arr) return;

    resetStats();

    renderBars(arr, bubbleContainer);

    const bars = bubbleContainer.children;

    const start = performance.now();

    for (let i = 0; i < arr.length; i++) {

        for (let j = 0; j < arr.length - i - 1; j++) {

            comparisons++;

            bars[j].classList.add("active");
            bars[j + 1].classList.add("active");

            updateStats();

            await sleep(120);

            if (arr[j] > arr[j + 1]) {

                swaps++;

                [arr[j], arr[j + 1]] =
                [arr[j + 1], arr[j]];

                bars[j].style.height =
                    `${arr[j]}px`;

                bars[j + 1].style.height =
                    `${arr[j + 1]}px`;

                bars[j].classList.add("swap");
                bars[j + 1].classList.add("swap");

                updateStats();
            }

            await sleep(100);

            bars[j].classList.remove(
                "active",
                "swap"
            );

            bars[j + 1].classList.remove(
                "active",
                "swap"
            );
        }

        bars[arr.length - i - 1]
            .classList.add("sorted");
    }

    const end = performance.now();

    executionTime.textContent =
        `${(end - start).toFixed(2)} ms`;

    bubbleResult.innerHTML = `
        <strong>Sorted Array:</strong><br>
        ${arr.join(", ")}<br><br>

        <strong>Complexity:</strong> O(n²)<br>
        <strong>Comparisons:</strong> ${comparisons}<br>
        <strong>Swaps:</strong> ${swaps}
    `;
}

// ==========================
// MERGE SORT
// ==========================

async function visualizeMergeSort() {

    const arr = getInputArray();

    if (!arr) return;

    resetStats();

    renderBars(arr, mergeContainer);

    const bars = mergeContainer.children;

    const start = performance.now();

    async function mergeSort(startIndex, endIndex) {

        if (startIndex >= endIndex) return;

        const mid =
            Math.floor((startIndex + endIndex) / 2);

        await mergeSort(startIndex, mid);
        await mergeSort(mid + 1, endIndex);

        await merge(startIndex, mid, endIndex);
    }

    async function merge(startIndex, mid, endIndex) {

        const left =
            arr.slice(startIndex, mid + 1);

        const right =
            arr.slice(mid + 1, endIndex + 1);

        let i = 0;
        let j = 0;
        let k = startIndex;

        while (
            i < left.length &&
            j < right.length
        ) {

            comparisons++;

            if (left[i] <= right[j]) {
                arr[k] = left[i];
                i++;
            } else {
                arr[k] = right[j];
                j++;
            }

            bars[k].style.height =
                `${arr[k]}px`;

            bars[k].classList.add("active");

            updateStats();

            await sleep(120);

            bars[k].classList.remove("active");

            k++;
        }

        while (i < left.length) {

            arr[k] = left[i];

            bars[k].style.height =
                `${arr[k]}px`;

            i++;
            k++;

            await sleep(50);
        }

        while (j < right.length) {

            arr[k] = right[j];

            bars[k].style.height =
                `${arr[k]}px`;

            j++;
            k++;

            await sleep(50);
        }
    }

    await mergeSort(0, arr.length - 1);

    for (let bar of bars) {

        bar.classList.add("sorted");

        await sleep(30);
    }

    const end = performance.now();

    executionTime.textContent =
        `${(end - start).toFixed(2)} ms`;

    mergeResult.innerHTML = `
        <strong>Sorted Array:</strong><br>
        ${arr.join(", ")}<br><br>

        <strong>Complexity:</strong> O(n log n)<br>
        <strong>Comparisons:</strong> ${comparisons}
    `;
}

// ==========================
// RESET
// ==========================

function resetVisualizer() {

    bubbleContainer.innerHTML = "";
    mergeContainer.innerHTML = "";

    bubbleResult.textContent =
        "Waiting for visualization...";

    mergeResult.textContent =
        "Waiting for visualization...";

    resetStats();
}

// ==========================
// DARK MODE
// ==========================

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    if (
        document.body.classList.contains(
            "light-mode"
        )
    ) {
        themeToggle.textContent =
            "☀️ Light Mode";
    } else {
        themeToggle.textContent =
            "🌙 Dark Mode";
    }
});

// ==========================
// EVENTS
// ==========================

generateBtn.addEventListener(
    "click",
    generateRandomArray
);

bubbleBtn.addEventListener(
    "click",
    visualizeBubbleSort
);

mergeBtn.addEventListener(
    "click",
    visualizeMergeSort
);

resetBtn.addEventListener(
    "click",
    resetVisualizer
);

// ==========================
// INITIAL LOAD
// ==========================

generateRandomArray();