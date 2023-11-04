"use strict";

(() => {
  const BOARD_SIZE = 11;
  const FIELD_SIZE = 8;
  const NUMBER_OF_PLAYERS = 4;

  const PLAYER_COLORS = Object.freeze([
    "var(--yellow)",
    "var(--green)",
    "var(--red)",
    "var(--black)",
  ]);

  let diceRolledOver = false;
  let playerOnTurn = -1;
  let playerThrewDice = false;

  const boxElm = document.createElement("div");

  boxElm.classList.add("box");

  const boardElm = document.createElement("div");

  boardElm.classList.add("board");

  boardElm.style.cssText = `
    height: ${BOARD_SIZE * FIELD_SIZE}vmin;
    min-height: ${BOARD_SIZE * FIELD_SIZE}vmin;
    min-width: ${BOARD_SIZE * FIELD_SIZE}vmin;
    width: ${BOARD_SIZE * FIELD_SIZE}vmin;
  `;

  boxElm.appendChild(boardElm);

  document.body.appendChild(boxElm);

  function createBoard() {
    const PATH_OF_BOARD = Object.freeze([
      [
        ["right", 2],
        ["bottom", 4],
        ["right", 4],
      ],
      [
        ["bottom", 2],
        ["left", 4],
        ["bottom", 4],
      ],
      [
        ["left", 2],
        ["top", 4],
        ["left", 4],
      ],
      [
        ["top", 2],
        ["right", 4],
        ["top", 4],
      ],
    ]);

    const currentPositionOnPath = { x: 4, y: 0 };

    for (const pathSection of PATH_OF_BOARD) {
      for (const [direction, steps] of pathSection) {
        for (let step = 0; step < steps; step++) {
          const lineOffset = { x: 0, y: 0 };

          switch (direction) {
            case "top":
              currentPositionOnPath.y--;
              lineOffset.y += FIELD_SIZE;
              break;
            case "right":
              currentPositionOnPath.x++;
              lineOffset.x -= FIELD_SIZE;
              break;
            case "bottom":
              currentPositionOnPath.y++;
              break;
            case "left":
              currentPositionOnPath.x--;
              break;
          }

          const lineElm = document.createElement("div");

          lineElm.classList.add("line");

          lineElm.style.cssText = `
            height: ${FIELD_SIZE}vmin;
            left: ${
              currentPositionOnPath.x * FIELD_SIZE +
              FIELD_SIZE / 2 +
              lineOffset.x
            }vmin;
            top: ${
              currentPositionOnPath.y * FIELD_SIZE -
              FIELD_SIZE / 2 +
              lineOffset.y
            }vmin;
            width: ${FIELD_SIZE}vmin;
          `;

          if (["top", "bottom"].includes(direction)) {
            lineElm.style.borderLeft = "1px solid var(--black)";
          } else if (["right", "left"].includes(direction)) {
            lineElm.style.borderBottom = "1px solid var(--black)";
          }

          boardElm.appendChild(lineElm);
        }
      }
    }

    for (const [i, pathSection] of PATH_OF_BOARD.entries()) {
      for (const [j, [direction, steps]] of pathSection.entries()) {
        for (let step = 0; step < steps; step++) {
          switch (direction) {
            case "top":
              currentPositionOnPath.y--;
              break;
            case "right":
              currentPositionOnPath.x++;
              break;
            case "bottom":
              currentPositionOnPath.y++;
              break;
            case "left":
              currentPositionOnPath.x--;
              break;
          }

          const fieldElm = document.createElement("div");

          fieldElm.classList.add("field");

          fieldElm.style.cssText = `
            height: ${FIELD_SIZE}vmin;
            left: ${currentPositionOnPath.x * FIELD_SIZE}vmin;
            top: ${currentPositionOnPath.y * FIELD_SIZE}vmin;
            width: ${FIELD_SIZE}vmin;
          `;

          const circleElm = document.createElement("div");

          circleElm.classList.add("circle");

          if (j === 0 && step === 1) {
            fieldElm.classList.add("start-pos");

            circleElm.style.backgroundColor = PLAYER_COLORS[i];
          } else {
            circleElm.style.backgroundColor = "var(--white)";
          }

          fieldElm.appendChild(circleElm);

          boardElm.appendChild(fieldElm);
        }
      }
    }
  }

  function createHouses() {
    const HOUSES = Object.freeze([
      [
        [9, 0],
        [10, 0],
        [9, 1],
        [10, 1],
      ],
      [
        [9, 9],
        [10, 9],
        [9, 10],
        [10, 10],
      ],
      [
        [0, 9],
        [1, 9],
        [0, 10],
        [1, 10],
      ],
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    ]);

    for (const [i, house] of HOUSES.entries()) {
      for (const [x, y] of house) {
        const houseElm = document.createElement("div");

        houseElm.classList.add("house", `player-${i}`);

        houseElm.style.cssText = `
          height: ${FIELD_SIZE}vmin;
          left: ${x * FIELD_SIZE}vmin;
          top: ${y * FIELD_SIZE}vmin;
          width: ${FIELD_SIZE}vmin;
        `;

        const circleElm = document.createElement("div");

        circleElm.classList.add("circle");
        circleElm.style.backgroundColor = PLAYER_COLORS[i];

        houseElm.appendChild(circleElm);

        boardElm.appendChild(houseElm);
      }
    }
  }

  function moveFigure(figureElm, target, afterMoving) {
    const occupiedFigureElm = target.querySelector(".figure");

    if (occupiedFigureElm) {
      if (occupiedFigureElm.classList.contains(`player-${playerOnTurn}`))
        return;

      const targetHouseElms = document.querySelectorAll(
        `.house.${occupiedFigureElm.classList[1]}`
      );

      for (const targetHouseElm of targetHouseElms) {
        if (!targetHouseElm.querySelector(".figure")) {
          occupiedFigureElm.remove();

          targetHouseElm.appendChild(occupiedFigureElm);

          break;
        }
      }
    }

    figureElm.remove();

    target.appendChild(figureElm);

    const diceElms = document.querySelectorAll(".dice");
    const activeDiceElm = diceElms[playerOnTurn];

    activeDiceElm.style.boxShadow = `0 0 1rem ${PLAYER_COLORS[playerOnTurn]}`;

    afterMoving();
  }

  function canPlayerMove(diceValue = 0) {
    const playerHouseElms = document.querySelectorAll(
      `.house:not(.destination).player-${playerOnTurn}`
    );

    const isFigureInPlayerHouse = Array.from(playerHouseElms).some((houseElm) =>
      houseElm.querySelector(".figure")
    );

    const startPlayerPositionElm =
      document.querySelectorAll(".start-pos")[playerOnTurn];

    const isFreePlayerPositionToStart = !startPlayerPositionElm.querySelector(
      `.figure.player-${playerOnTurn}`
    );

    const fieldElms = document.querySelectorAll(".field");

    const canPlayerMoveOnPath = Array.from(fieldElms).some((fieldElm) => {
      const playerFigureElm = fieldElm.querySelector(
        `.figure.player-${playerOnTurn}`
      );

      if (playerFigureElm?.parentElement) {
        const playerFigurePositionIndex = Array.from(fieldElms).indexOf(
          playerFigureElm.parentElement
        );

        let playerPosition =
          playerFigurePositionIndex -
          playerOnTurn * (fieldElms.length / NUMBER_OF_PLAYERS);

        if (playerPosition <= 0) {
          playerPosition += fieldElms.length;
        }

        const playerDestinationHouseElms = document.querySelectorAll(
          `.destination.house.player-${playerOnTurn}`
        );

        if (playerPosition + diceValue > fieldElms.length) {
          if (
            playerPosition + diceValue <=
            fieldElms.length + playerDestinationHouseElms.length
          ) {
            return !playerDestinationHouseElms[
              playerPosition + diceValue - fieldElms.length - 1
            ].querySelector(".figure");
          }

          return false;
        }

        const targetField =
          fieldElms[(playerFigurePositionIndex + diceValue) % fieldElms.length];

        return (
          targetField &&
          !targetField.querySelector(`.figure.player-${playerOnTurn}`)
        );
      }

      return false;
    });

    return (
      (isFigureInPlayerHouse &&
        isFreePlayerPositionToStart &&
        diceValue === 6) ||
      canPlayerMoveOnPath
    );
  }

  function moveToNextPlayer(diceValue) {
    playerThrewDice = false;
    diceRolledOver = false;

    if (diceValue === 6) return;

    playerOnTurn = ++playerOnTurn % NUMBER_OF_PLAYERS;

    const diceElms = document.querySelectorAll(".dice");

    for (const diceElm of diceElms) {
      diceElm.disabled = true;
      diceElm.style.borderColor = "var(--gray)";
      diceElm.style.boxShadow = "";
    }

    const activeDiceElm = diceElms[playerOnTurn];

    activeDiceElm.disabled = false;
    activeDiceElm.style.borderColor = "var(--black)";
    activeDiceElm.style.boxShadow = `0 0 1rem ${PLAYER_COLORS[playerOnTurn]}`;
  }

  function handleFigureClick(figureElm, i) {
    if (i !== playerOnTurn || !diceRolledOver) return;

    const isFigureInHouse = figureElm.parentElement
      ? figureElm.parentElement.classList.contains("house")
      : false;

    const diceElms = document.querySelectorAll(".dice");
    const diceValue = parseInt(diceElms[i].innerText, 10);

    if (isFigureInHouse) {
      if (figureElm.parentElement?.classList.contains("destination")) {
        return;
      }

      if (diceValue === 6) {
        const startPositionElm = document.querySelectorAll(".start-pos")[i];

        moveFigure(figureElm, startPositionElm, () => {
          if (!canPlayerMove()) {
            moveToNextPlayer(diceValue);
          }
        });
      }
    } else {
      const fieldElms = document.querySelectorAll(".field");

      const figurePositionIndex = figureElm.parentElement
        ? Array.from(fieldElms).indexOf(figureElm.parentElement)
        : 0;

      let playerPosition =
        figurePositionIndex -
        playerOnTurn * (fieldElms.length / NUMBER_OF_PLAYERS);

      if (playerPosition <= 0) {
        playerPosition += fieldElms.length;
      }

      if (playerPosition + diceValue > fieldElms.length) {
        const playerDestinationHouseElms = document.querySelectorAll(
          `.destination.house.player-${playerOnTurn}`
        );

        if (
          playerPosition + diceValue <=
          fieldElms.length + playerDestinationHouseElms.length
        ) {
          moveFigure(
            figureElm,
            playerDestinationHouseElms[
              playerPosition + diceValue - fieldElms.length - 1
            ],
            () => {
              moveToNextPlayer(diceValue);
            }
          );
        }
      } else {
        const targetField =
          fieldElms[(figurePositionIndex + diceValue) % fieldElms.length];

        moveFigure(figureElm, targetField, () => {
          moveToNextPlayer(diceValue);
        });
      }
    }
  }

  function createFigures() {
    const houseElms = document.querySelectorAll(".house:not(.destination)");

    for (const houseElm of houseElms) {
      const i = parseInt(
        houseElm.className.match(/player-\d/u)?.[0].match(/\d/u)?.[0] ?? "",
        10
      );

      const figureElm = document.createElement("button");

      figureElm.classList.add("figure", `player-${i}`);

      figureElm.style.cssText = `
        background-color: ${PLAYER_COLORS[i]};
        height: ${FIELD_SIZE / 2.5}vmin;
        width: ${FIELD_SIZE / 2.5}vmin;
      `;

      figureElm.addEventListener("click", () =>
        handleFigureClick(figureElm, i)
      );

      houseElm.appendChild(figureElm);
    }
  }

  function createDestinationHouses() {
    const DESTINATION_HOUSES = Object.freeze([
      [
        [5, 1],
        [5, 2],
        [5, 3],
        [5, 4],
      ],
      [
        [9, 5],
        [8, 5],
        [7, 5],
        [6, 5],
      ],
      [
        [5, 9],
        [5, 8],
        [5, 7],
        [5, 6],
      ],
      [
        [1, 5],
        [2, 5],
        [3, 5],
        [4, 5],
      ],
    ]);

    for (const [i, destinationHouse] of DESTINATION_HOUSES.entries()) {
      for (const [x, y] of destinationHouse) {
        const destinationHouseElm = document.createElement("div");

        destinationHouseElm.classList.add(
          "destination",
          "house",
          `player-${i}`
        );

        destinationHouseElm.style.cssText = `
          height: ${FIELD_SIZE}vmin;
          left: ${x * FIELD_SIZE}vmin;
          top: ${y * FIELD_SIZE}vmin;
          width: ${FIELD_SIZE}vmin;
        `;

        const circleElm = document.createElement("div");

        circleElm.classList.add("circle");
        circleElm.style.backgroundColor = PLAYER_COLORS[i];

        destinationHouseElm.appendChild(circleElm);

        boardElm.appendChild(destinationHouseElm);
      }
    }
  }

  function handleDiceClick(diceElm, i) {
    if (i !== playerOnTurn || playerThrewDice) return;

    playerThrewDice = true;

    diceElm.style.boxShadow = "";

    let turns = 0;

    const interval = setInterval(() => {
      turns++;

      const diceValue = Math.floor(Math.random() * 6) + 1;

      diceElm.innerText = diceValue.toString();

      if (turns >= 10) {
        clearInterval(interval);

        diceRolledOver = true;

        if (!canPlayerMove(diceValue)) {
          moveToNextPlayer();
        }
      }
    }, 100);
  }

  function createDices() {
    const DICE_POSITIONS = Object.freeze([
      {
        right: "20vmin",
        top: "5vmin",
      },
      {
        bottom: "5vmin",
        right: "20vmin",
      },
      {
        bottom: "5vmin",
        left: "20vmin",
      },
      {
        left: "20vmin",
        top: "5vmin",
      },
    ]);

    for (const [i, dicePosition] of DICE_POSITIONS.entries()) {
      const diceElm = document.createElement("button");

      diceElm.classList.add("dice");

      for (const [key, value] of Object.entries(dicePosition)) {
        diceElm.style[key] = value;
      }

      diceElm.innerText = String(Math.floor(Math.random() * 5) + 1);

      diceElm.addEventListener("click", () => handleDiceClick(diceElm, i));

      boardElm.appendChild(diceElm);
    }
  }

  createBoard();

  createHouses();

  createFigures();

  createDestinationHouses();

  createDices();

  moveToNextPlayer();
})();
