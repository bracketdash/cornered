import { useState } from "react";
import Head from "next/head";

export default function Home() {
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
  boardArr[2][2].checkers = 4;
  boardArr[2][2].owner = "left";
  boardArr[5][5].checkers = 4;
  boardArr[5][5].owner = "right";

  // set up our template variables
  const [board, setBoard] = useState(boardArr);
  const [leftCheckers, setLeftCheckers] = useState(20);
  const [rightCheckers, setRightCheckers] = useState(20);
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
      target.checkers < 4 &&
      (!target.owner || target.owner === whoseTurn) &&
      board[row][column].checkers - movesThisTurn[row][column] > 0 &&
      !(
        board[row][column].checkers === 1 &&
        ((whoseTurn === "left" && row === 2 && column === 2) ||
          (whoseTurn === "right" && row === 5 && column === 5))
      )
    ) {
      // just movin' pieces
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
  const isContiguous = (ri, ci, from) => {
    if (from !== "above" && ri !== 0 && board[ri - 1][ci].owner === whoseTurn) {
      // TODO: if [ri-1][ci] is whoseTurn's capital, return true
      // TODO: if not, return isContiguous(ri-1, ci, "below")
    } else if (from !== "right" && ci !== 8) {
      // TODO: if [ri][ci+1] is whoseTurn's capital, return true
      // TODO: if not, return isContiguous(ri, ci+1, "left")
    } else if (from !== "below" && ri !== 8) {
      // TODO: if [ri+1][ci] is whoseTurn's capital, return true
      // TODO: if not, return isContiguous(ri+1, ci, "above")
    } else if (from !== "left" && ci !== 0) {
      // TODO: if [ri][ci-1] is whoseTurn's capital, return true
      // TODO: if not, return isContiguous(ri+1, ci, "above")
    }
  };
  const switchPlayerTo = (which) => {
    const qualifyingSquares = [];
    board.forEach((columns, ri) => {
      columns.forEach((square, ci) => {
        if (
          !!square.owner &&
          square.owner !== whoseTurn &&
          square.checkers < 4 &&
          isContiguous(ri, ci)
        ) {
          qualifyingSquares.push([ri, ci]);
        }
      });
    });
    console.log(qualifyingSquares);
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
    } else {
      // TODO: if we don't have enough, let the player choose which squares
    }
    setMovesThisTurn(
      Array(8)
        .fill(1)
        .map(() => Array(8).fill(0))
    );
    setWhoseTurn(which);
  };

  // the template
  return (
    <div className="container">
      <Head>
        <title>Cornered</title>
      </Head>
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
              {row ? (
                <div
                  className="up"
                  onClick={() => move(row, column, -1, 0)}
                ></div>
              ) : null}
              {column < 7 ? (
                <div
                  className="right"
                  onClick={() => move(row, column, 0, 1)}
                ></div>
              ) : null}
              {row < 7 ? (
                <div
                  className="down"
                  onClick={() => move(row, column, 1, 0)}
                ></div>
              ) : null}
              {column ? (
                <div
                  className="left"
                  onClick={() => move(row, column, 0, -1)}
                ></div>
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
          {whoseTurn === "left" ? "Blue" : "Orange"}'s turn
        </div>
        <div className="checkers-left right">Orange: {rightCheckers}</div>
      </footer>
    </div>
  );
}
