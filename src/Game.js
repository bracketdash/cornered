import { useState } from "react";

// const CHECKER_MAX_MOVES = 2;
const MAX_PER_SQUARE = 5;
const STARTING_CHECKERS = 50;

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
  const [movesThisTurn, setMovesThisTurn] = useState(
    Array(8)
      .fill(1)
      .map(() => Array(8).fill(0))
  );

  // handle moving and attacking
  const move = (row, column, rowDelta, columnDelta) => {
    const target = board[row + rowDelta][column + columnDelta];
    if (
      target.checkers < MAX_PER_SQUARE &&
      (!target.owner || target.owner === whoseTurn) &&
      board[row][column].checkers - movesThisTurn[row][column] > 0 &&
      !(
        board[row][column].checkers === 1 &&
        ((whoseTurn === "left" && row === 2 && column === 2) ||
          (whoseTurn === "right" && row === 5 && column === 5))
      )
    ) {
      // just movin' pieces
      // TODO: support CHECKER_MAX_MOVES
      setMovesThisTurn((state) =>
        state.map((columns, ri) =>
          columns.map((moves, ci) => {
            if (ri === row + rowDelta && ci === column + columnDelta) {
              return moves + 1;
            }
            return moves;
          })
        )
      );
      setBoard((state) =>
        state.map((columns, ri) =>
          columns.map((square, ci) => {
            if (ri === row + rowDelta && ci === column + columnDelta) {
              return {
                checkers: square.checkers + 1,
                owner: whoseTurn,
              };
            } else if (ri === row && ci === column) {
              return {
                checkers: square.checkers - 1,
                owner: square.checkers === 1 ? "" : whoseTurn,
              };
            }
            return { ...square };
          })
        )
      );
    } else if (!!target.owner && target.owner !== whoseTurn) {
      // we're attacking!
      if (!Math.floor(Math.random() * 2)) {
        // target loses one
        if (whoseTurn === "left") {
          setRightCheckers(rightCheckers + 1);
        } else {
          setLeftCheckers(leftCheckers + 1);
        }
        setBoard((state) =>
          state.map((columns, ri) =>
            columns.map((square, ci) => {
              if (ri === row + rowDelta && ci === column + columnDelta) {
                return {
                  checkers: square.checkers - 1,
                  owner: square.checkers === 1 ? "" : square.owner,
                };
              }
              return { ...square };
            })
          )
        );
      } else {
        // origin loses one
        if (whoseTurn === "left") {
          setLeftCheckers(leftCheckers + 1);
        } else {
          setRightCheckers(rightCheckers + 1);
        }
        setBoard((state) =>
          state.map((columns, ri) =>
            columns.map((square, ci) => {
              if (ri === row && ci === column) {
                return {
                  checkers: square.checkers - 1,
                  owner: square.checkers === 1 ? "" : whoseTurn,
                };
              }
              return { ...square };
            })
          )
        );
      }
    }
  };

  // handle switching players
  const switchPlayerTo = (which) => {
    let qualifyingSquares = [];
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
      setBoard((state) =>
        state.map((columns, ri) =>
          columns.map((square, ci) => {
            if (qualifyingSquares.some((rc) => rc[0] === ri && rc[1] === ci)) {
              return {
                checkers: square.checkers + 1,
                owner: square.owner,
              };
            }
            return { ...square };
          })
        )
      );
    }
    setMovesThisTurn(
      Array(8)
        .fill(1)
        .map(() => Array(8).fill(0))
    );
    setWhoseTurn(which);
  };

  // the template
  // TODO: hide arrows if no moves available
  const Cell = (props) => (
    <div
      className={`${props.square.owner}${
        props.square.owner === whoseTurn ? " hoverable" : ""
      }`}
      key={`${props.row}.${props.column}`}
    >
      <div className="square">
        {props.square.checkers ? props.square.checkers : ""}
      </div>
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
            <Cell square={square} row={row} column={column} />
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
