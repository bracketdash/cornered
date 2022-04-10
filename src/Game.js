import { useState } from "react";

const MAX_MOVES_PER_TURN = 4;
const MAX_PER_SQUARE = 5;
const STARTING_CHECKERS = 45;

export default function Game() {
  // create the board
  const boardArr = Array(8)
    .fill(1)
    .map(() =>
      Array(8)
        .fill(1)
        .map(() => ({
          checkers: 0,
          owner: "",
        }))
    );
  boardArr[2][2].checkers = MAX_PER_SQUARE;
  boardArr[2][2].owner = "left";
  boardArr[5][5].checkers = MAX_PER_SQUARE;
  boardArr[5][5].owner = "right";

  // set up our template variables
  const [board, setBoard] = useState(boardArr);
  const [leftCheckers, setLeftCheckers] = useState(
    STARTING_CHECKERS - MAX_PER_SQUARE
  );
  const [rightCheckers, setRightCheckers] = useState(
    STARTING_CHECKERS - MAX_PER_SQUARE
  );
  const [whoseTurn, setWhoseTurn] = useState("left");
  const [moves, setMoves] = useState(MAX_MOVES_PER_TURN - 1);

  // handle battles
  const battle = (attacking, defending) => {
    const pairs = Math.min(attacking, defending);
    const roll = Math.ceil(Math.random() * pairs);
    const victors = Math.min(roll, pairs);
    const attackersLost = victors < pairs ? pairs - victors : 0;
    let attackingAfter = attacking - attackersLost;
    let defendingAfter = defending - victors;
    let occupied = defendingAfter === 0;
    if (occupied) {
      defendingAfter = attackingAfter - 1;
      attackingAfter = 1;
    }
    return [attackingAfter, defendingAfter, occupied];
  };

  // handle moving and attacking
  const move = (row, column, rowDelta, columnDelta) => {
    const target = board[row + rowDelta][column + columnDelta];
    if (
      target.checkers < MAX_PER_SQUARE &&
      (!target.owner || target.owner === whoseTurn)
    ) {
      // just movin' pieces
      const moving = Math.min(
        5 - target.checkers,
        board[row][column].checkers - 1
      );
      setBoard((state) =>
        state.map((columns, ri) =>
          columns.map((square, ci) => {
            if (ri === row + rowDelta && ci === column + columnDelta) {
              return {
                checkers: square.checkers + moving,
                owner: whoseTurn,
              };
            } else if (ri === row && ci === column) {
              return {
                checkers: square.checkers - moving,
                owner: whoseTurn,
              };
            }
            return { ...square };
          })
        )
      );
    } else if (!!target.owner && target.owner !== whoseTurn) {
      // we're attacking!
      const outcome = battle(board[row][column].checkers, target.checkers);
      if (whoseTurn === "left") {
        setLeftCheckers((s) => s + (board[row][column].checkers - outcome[0]));
        setRightCheckers((s) => s + (target.checkers - outcome[1]));
      } else {
        setLeftCheckers((s) => s + (target.checkers - outcome[1]));
        setRightCheckers((s) => s + (board[row][column].checkers - outcome[0]));
      }
      setBoard((state) =>
        state.map((columns, ri) =>
          columns.map((square, ci) => {
            if (ri === row + rowDelta && ci === column + columnDelta) {
              return {
                checkers: outcome[1],
                owner: outcome[2] ? whoseTurn : square.owner,
              };
            } else if (ri === row && ci === column) {
              return {
                checkers: outcome[0],
                owner: whoseTurn,
              };
            }
            return { ...square };
          })
        )
      );
    } else {
      return;
    }

    // handle max moves per turn
    if (!moves) {
      switchPlayerTo(whoseTurn === "left" ? "right" : "left");
      return;
    }
    setBoard((state) => {
      let atLeastOneMoveAvailable = false;
      state.forEach((columns, ri) => {
        columns.forEach((square, ci) => {
          if (square.owner === whoseTurn && square.checkers > 1) {
            atLeastOneMoveAvailable = true;
          }
        });
      });
      if (!atLeastOneMoveAvailable) {
        switchPlayerTo(whoseTurn === "left" ? "right" : "left");
      } else {
        setMoves(moves - 1);
      }
      return state;
    });
  };

  // handle switching players
  const switchPlayerTo = async (which) => {
    let qualifyingSquares = [];
    setMoves(MAX_MOVES_PER_TURN - 1);
    setBoard((board) => {
      board.forEach((columns, ri) => {
        columns.forEach((square, ci) => {
          if (
            !!square.owner &&
            square.owner !== whoseTurn &&
            square.checkers < MAX_PER_SQUARE
          ) {
            qualifyingSquares.push([ri, ci]);
          }
        });
      });
      if (
        (whoseTurn === "right" && qualifyingSquares.length <= leftCheckers) ||
        (whoseTurn === "left" && qualifyingSquares.length <= rightCheckers)
      ) {
        if (whoseTurn === "right") {
          setLeftCheckers(leftCheckers - qualifyingSquares.length);
        } else {
          setRightCheckers(rightCheckers - qualifyingSquares.length);
        }
        board = board.map((columns, ri) =>
          columns.map((square, ci) => {
            if (qualifyingSquares.some((rc) => rc[0] === ri && rc[1] === ci)) {
              return {
                checkers: square.checkers + 1,
                owner: square.owner,
              };
            }
            return { ...square };
          })
        );
      }
      setWhoseTurn(which);
      return board;
    });
  };

  // the template
  const Arrows = (props) => (
    <div>
      {props.row ? (
        <div
          className="up"
          onClick={() => move(props.row, props.column, -1, 0)}
        ></div>
      ) : null}
      {props.column < 7 ? (
        <div
          className="right"
          onClick={() => move(props.row, props.column, 0, 1)}
        ></div>
      ) : null}
      {props.row < 7 ? (
        <div
          className="down"
          onClick={() => move(props.row, props.column, 1, 0)}
        ></div>
      ) : null}
      {props.column ? (
        <div
          className="left"
          onClick={() => move(props.row, props.column, 0, -1)}
        ></div>
      ) : null}
    </div>
  );
  return (
    <div className="container">
      <main className="board">
        {board.map((columns, row) =>
          columns.map((square, column) => (
            <div
              className={`${square.owner}${
                square.owner === whoseTurn ? " hoverable" : ""
              }`}
              key={`${row}.${column}`}
            >
              <div className="square">
                {square.checkers ? square.checkers : ""}
              </div>
              {square.checkers && square.checkers > 1 ? (
                <Arrows row={row} column={column} />
              ) : null}
            </div>
          ))
        )}
      </main>
      <footer className="footer">
        <div className="checkers-left left">Blue: {leftCheckers}</div>
        <div
          className={`switch ${whoseTurn === "left" ? "blue" : "orange"}`}
          onClick={() =>
            switchPlayerTo(whoseTurn === "left" ? "right" : "left")
          }
        >
          {whoseTurn === "left" ? "Blue" : "Orange"}&apos;s turn
        </div>
        <div className="checkers-left right">Orange: {rightCheckers}</div>
      </footer>
    </div>
  );
}
