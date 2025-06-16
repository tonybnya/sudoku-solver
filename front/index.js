const puzzle = document.querySelector("#puzzle");
const solveBtn = document.querySelector("#solve-btn");
const clearBtn = document.querySelector("#clear-btn");
const status = document.querySelector("#status");
const puzzleBtn = document.querySelector("#puzzle-btn");
const squares = 81;
const submission = [];

const joinValues = () => {
  const inputs = document.querySelectorAll("#puzzle input");
  inputs.forEach((input) => {
    if (input.value) {
      submission.push(input.value);
    } else {
      submission.push(".");
    }
  });
  console.log(submission);
};

const fillSolution = (isSolvable, solution) => {
  const inputs = document.querySelectorAll("#puzzle input");
  if (isSolvable && solution) {
    inputs.forEach((input, i) => {
      input.value = solution[i];
    });
  }
};

const clearPuzzle = () => {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.value = "";
  });
};

const setPuzzle = (puzzle) => {
  const inputs = document.querySelectorAll("#puzzle input");
  for (let i = 0; i < inputs.length && i < puzzle.length; i++) {
    inputs[i].value = puzzle[i] === "." ? "" : puzzle[i];
  }
};

const loadPuzzle = async () => {
  try {
    const options = {
      method: "GET",
      url: "http://localhost:8000/api/puzzle",
      headers: {
        "API-KEY":
          "438f7c88057ac8f4162df40444c8d3b0c6fc6138f21d5a52743a2a1f620bb287",
        "Content-Type": "application/json",
      },
    };

    // Make the request to your API using axios
    const response = await axios.request(options);

    // With axios, the data is already parsed and available in response.data
    const solvablePuzzle = response.data.puzzle;

    setPuzzle(solvablePuzzle);
    // showStatus("Example puzzle loaded!");
  } catch (error) {
    console.error("Error loading puzzle:", error);
    // showStatus("Failed to load example puzzle!");
  }
};

const solve = async () => {
  joinValues();

  const puzzleString = submission.join("");
  console.log(puzzleString);

  const options = {
    method: "POST",
    url: "https://solve-sudoku.p.rapidapi.com/",
    headers: {
      "x-rapidapi-key": "429d4b4e4emshd73d3b4cccd15edp142cc9jsnc87c2c1511fa",
      "x-rapidapi-host": "solve-sudoku.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      puzzle: puzzleString,
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    const isSolvable = response.data.solvable;
    const solution = response.data.solution;
    fillSolution(isSolvable, solution);
  } catch (error) {
    console.error(error);
  }
};

for (let i = 0; i < squares; i++) {
  const square = document.createElement("input");
  square.setAttribute("type", "number");
  square.setAttribute("min", "1");
  square.setAttribute("max", "9");
  puzzle.appendChild(square);
}

puzzleBtn.addEventListener("click", loadPuzzle);
solveBtn.addEventListener("click", solve);
clearBtn.addEventListener("click", clearPuzzle);
