const COMPUTER = +1;
const PLAYER = -1;
function wins(m) {
  let arr = [0, 0];
  for (let i = 0; i < 3; i++) {
    arr[0] += m[i][i];
    arr[1] += m[i][2 - i];
  }
  //   console.log(arr);
  if (arr.includes(3)) {
    return 1;
  } else if (arr.includes(-3)) {
    return -1;
  }
  for (let i = 0; i < 3; i++) {
    arr = [0, 0];
    for (let j = 0; j < 3; j++) {
      arr[0] += m[i][j];
      arr[1] += m[j][i];
    }
    // console.log(arr);
    if (arr.includes(3)) {
      return 1;
    } else if (arr.includes(-3)) {
      return -1;
    }
  }
  return 0;
}
let table = document.getElementById("table");
let txt = document.getElementById("txt");
let p1 = document.getElementById("p1");
let p2 = document.getElementById("p2");
let reset = document.getElementById("reset");
reset.addEventListener("click", function() {
  Array.from(table.querySelectorAll("td")).forEach(td => {
    td.textContent = "";
  });
  start();
});
// function nextTurn(x) {
//   return x === "O" ? "X" : "O";
// }
function start() {
  won = false;
  const matrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

  let str = "OX";
  let random = Math.floor(Math.random() * 2); // 0 or 1
  let PLR1_ch = str[random];
  let PLR2_ch = str.replace(PLR1_ch, "");
  let turn = "X";
  p1.textContent = PLR1_ch;
  p2.textContent = PLR2_ch;
  txt.textContent = `Player's turn`;
  let first_c = PLR1_ch === "O";
  if (first_c) {
    computerMove(matrix);
  }
  function CLicked(td, i, j) {
    return function(e) {
      //   console.log(i, j, "clicked", JSON.stringify(matrix, null, 2));

      if (matrix[i][j] === 0 && !won) {
        matrix[i][j] = PLAYER;
        td.textContent = turn;
        console.log(JSON.stringify(matrix), "before plr");
        a = wins(matrix);
        if (a === PLAYER) {
          txt.textContent = "Player Wins";
          won = true;
        } else if (a == COMPUTER) {
          txt.textContent = "Computer Wins";
          console.log(JSON.stringify(matrix), 1);
          won = true;
        } else {
          if (possibleMoves(matrix).length === 0) {
            txt.textContent = `Match Draw`;
          } else {
            console.log(JSON.stringify(matrix), "before comp");

            computerMove(matrix);
            console.log(JSON.stringify(matrix), "after comp");

            txt.textContent = `Player's  turn`;
            a = wins(matrix);
            if (a === PLAYER) {
              txt.textContent = "Player Wins";
              won = true;
            } else if (a == COMPUTER) {
              txt.textContent = "Computer Wins";
              console.log(matrix, 2);
              won = true;
            } else {
              if (possibleMoves(matrix).length === 0) {
                txt.textContent = `Match Draw`;
              }
            }
          }
        }
      }
    };
  }

  Array.from(table.querySelectorAll("tr")).forEach((tr, i) => {
    Array.from(tr.querySelectorAll("td")).forEach((td, j) => {
      td.addEventListener("click", CLicked(td, i, j));
    });
  });
}
function computerMove(matrix) {
  let [p, q] = computer(matrix, COMPUTER);
  console.log(p, q, "comp", JSON.stringify(matrix));
  if (p > -1 && q > -1) {
    matrix[p][q] = COMPUTER;
    el = document.getElementById(p + "" + q);
    el && (el.textContent = "O");
  }
}
start();
function possibleMoves(m) {
  let arr = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (m[i][j] == 0) {
        arr.push([i, j]);
      }
    }
  }
  return arr;
}

function minimax(state, depth, p) {
  let best = [-1, -1, p === COMPUTER ? -Infinity : Infinity];
  let score = wins(state);
  if (depth == 0 || score !== 0) {
    return [-1, -1, score];
  }
  for (let cell of possibleMoves(matrix)) {
    let [i, j] = cell;
    state[i][j] = p;
    score = minimax(state, depth - 1, -p);
    state[i][j] = 0;
    score[0] = i;
    score[1] = j;

    if (p == COMPUTER) {
      if (score[2] > best[2]) best = score;
    } else {
      if (score[2] < best[2]) best = score;
    }
  }

  return best;
}

function computer(old_m, p) {
  console.log(JSON.stringify(old_m), "old");
  matrix = JSON.parse(JSON.stringify(old_m));
  let depth = possibleMoves(matrix).length;
  if (depth == 0 || wins(matrix) != 0) return [-1, -1];
  console.log(depth);
  if (depth == 9) {
    x = Math.floor(Math.random() * 3);
    y = Math.floor(Math.random() * 3);
  } else {
    move = minimax(matrix, depth, p);
    x = move[0];
    y = move[1];
  }
  console.log([x, y]);
  return [x, y];
}
