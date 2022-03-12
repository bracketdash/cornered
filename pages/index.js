import { useState } from "react";
import Head from "next/head";

export default function Home() {
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
  const [board, setBoard] = useState(boardArr);
  const [leftCheckers, setLeftCheckers] = useState(24);
  const [rightCheckers, setRightCheckers] = useState(24);
  const [whoseTurn, setWhoseTurn] = useState("left");
  return (
    <div className="container">
      <Head>
        <title>Cornered</title>
      </Head>
      <main className="board">
        {board.map((columns, row) =>
          columns.map((square, column) => (
            <div
              className={`${square.owner} ${
                square.owner === whoseTurn ? "hoverable" : ""
              }`}
              key={`${row}.${column}`}
            >
              <div className="square">
                {square.checkers ? square.checkers : ""}
              </div>
              <div className="up"></div>
              <div className="right"></div>
              <div className="down"></div>
              <div className="left"></div>
            </div>
          ))
        )}
      </main>
      <footer className="footer">
        <div className="checkers-left left">Blue: {leftCheckers}</div>
        <div
          className={`switch ${whoseTurn === "left" ? "blue" : "orange"}`}
          onClick={() => setWhoseTurn(whoseTurn === "left" ? "right" : "left")}
        >
          {whoseTurn === "left" ? "Blue" : "Orange"}'s turn
        </div>
        <div className="checkers-left right">Orange: {rightCheckers}</div>
      </footer>
    </div>
  );
}
