// Import CSS for Vite to process
import "./index.css";

// Add a listener to show when the app is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("Sudoku Solver app loaded successfully");
});

const puzzle = document.querySelector("#puzzle");
const solveBtn = document.querySelector("#solve-btn");
const clearBtn = document.querySelector("#clear-btn");
const statusDiv = document.querySelector("#status");
const puzzleBtn = document.querySelector("#puzzle-btn");
const squares = 81;
const submission = [];

// Load environment variables (Vite automatically loads VITE_* vars from .env)
const apiUrl = import.meta.env.VITE_API_URL;
const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;
const rapidApiHost = import.meta.env.VITE_RAPIDAPI_HOST;

// Create a config object to store all environment variables
const config = {
  apiUrl,
  rapidApiKey,
  rapidApiHost,
};

const joinValues = () => {
  // Clear the submission array before adding new values
  submission.length = 0;

  const inputs = document.querySelectorAll("#puzzle input");
  inputs.forEach((input) => {
    if (input.value) {
      // Ensure the value is a valid digit between 1-9
      const value = parseInt(input.value);
      if (!isNaN(value) && value >= 1 && value <= 9) {
        submission.push(value.toString());
      } else {
        // If invalid value, treat as empty
        submission.push(".");
      }
    } else {
      submission.push(".");
    }
  });
  // console.log("Submission array:", submission);
};

const fillSolution = (isSolvable, solution) => {
  const inputs = document.querySelectorAll("#puzzle input");

  if (isSolvable === true && solution) {
    // Puzzle is solvable and we have a solution
    inputs.forEach((input, i) => {
      input.value = solution[i];
    });
    showStatus("Puzzle solved!");
  } else {
    // Handle different error cases
    if (isSolvable === false) {
      // The API explicitly said the puzzle is not solvable
      showStatus("The puzzle is not solvable! Check for mistakes.", true);
    } else if (!solution && isSolvable === true) {
      // Strange case: API says it's solvable but didn't return a solution
      showStatus(
        "Error: API reported puzzle as solvable but provided no solution",
        true,
      );
    } else {
      // Default error case
      showStatus("Unable to solve the puzzle. Please try again.", true);
    }
  }
};

const clearPuzzle = () => {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.value = "";
  });
  showStatus("Puzzle cleared!");
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
      url: `${config.apiUrl}/puzzle`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    console.log(`Fetching puzzle from: ${config.apiUrl}`);

    // Make the request to your API using axios
    const response = await axios.request(options);

    // With axios, the data is already parsed and available in response.data
    if (response.data && response.data.puzzle) {
      const solvablePuzzle = response.data.puzzle;
      setPuzzle(solvablePuzzle);
      showStatus("Puzzle loaded!");
    } else {
      console.error("Invalid response format:", response.data);
      showStatus("Invalid puzzle data received", true);
    }
  } catch (error) {
    console.error("Error loading puzzle:", error);
    showStatus(`Failed to load puzzle: ${error.message}`, true);
  }
};

const showStatus = (message, isError = false) => {
  statusDiv.textContent = message;
  statusDiv.className = `status ${isError ? "error" : "success"}`;
  statusDiv.style.display = "block";
  setTimeout(() => {
    statusDiv.style.display = "none";
  }, 3000);
};

const solve = async () => {
  joinValues();

  const puzzleString = submission.join("");

  // Debug the puzzle format
  let validChars = 0;
  let invalidChars = [];
  for (let i = 0; i < puzzleString.length; i++) {
    const char = puzzleString[i];
    if (char === "." || (char >= "1" && char <= "9")) {
      validChars++;
    } else {
      invalidChars.push({ index: i, char: char });
    }
  }
  if (invalidChars.length > 0) {
    console.log("Invalid characters found:", invalidChars);
  }

  // Check if the puzzle is valid (contains 81 characters)
  if (puzzleString.length !== 81) {
    showStatus(
      `Invalid puzzle length: ${puzzleString.length}/81 characters`,
      true,
    );
    return;
  }

  // Show solving status
  showStatus("Solving puzzle...");

  // Check if RapidAPI key is available
  if (!config.rapidApiKey || config.rapidApiKey === "your-api-key-here") {
    showStatus("Error: Missing API key for solver service", true);
    return;
  }

  // RapidAPI expects a specific format
  const options = {
    method: "POST",
    url: `https://${config.rapidApiHost}/`,
    headers: {
      "x-rapidapi-key": config.rapidApiKey,
      "x-rapidapi-host": config.rapidApiHost,
      "Content-Type": "application/json",
      // Accept: "application/json",
    },
    data: {
      puzzle: puzzleString,
    },
  };

  try {
    const response = await axios.request(options);

    if (response.data) {
      const isSolvable = response.data.solvable;
      const solution = response.data.solution;

      // Check if both values are present and valid
      if (isSolvable === undefined) {
        showStatus("Invalid API response format", true);
        return;
      }

      fillSolution(isSolvable, solution);
    } else {
      showStatus("Invalid response from solver service", true);
    }
  } catch (error) {
    showStatus(`Failed to solve puzzle: ${error.message}`, true);
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
