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
  boardArr[0][0].checkers = 4;
  boardArr[0][0].owner = "left";
  boardArr[7][7].checkers = 4;
  boardArr[7][7].owner = "right";

  // set up our template variables
  const [board, setBoard] = useState(boardArr);
  const [leftCheckers, setLeftCheckers] = useState(20);
  const [rightCheckers, setRightCheckers] = useState(20);
  const [whoseTurn, setWhoseTurn] = useState("left");

  // handle move/attack
  const move = (row, column, rowDelta, columnDelta) => {
    // TODO: prevent the same checker from being moved twice in the same turn
    const target = board[row + rowDelta][column + columnDelta];
    if (!target.owner) {
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
    } else if (target.owner === whoseTurn) {
      if (target.checkers < 4) {
        setBoard((state) =>
          state.map((columns, ri) =>
            columns.map((square, ci) => {
              // if (ri === row + rowDelta && ci === column + columnDelta) {
              //   return {
              //     checkers: square.checkers + 1,
              //     owner: whoseTurn,
              //   };
              // } else if (ri === row && ci === column) {
              //   return {
              //     checkers: square.checkers - 1,
              //     owner: square.checkers === 1 ? "" : whoseTurn,
              //   };
              // }
              return { ...square };
            })
          )
        );
      } else {
        alert("That square already has the maximum 4 checkers.");
      }
    }
    // TODO: handle attacking
  };

  // handle switch player
  const switchPlayerTo = (which) => {
    // TODO: handle reinforcements
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
