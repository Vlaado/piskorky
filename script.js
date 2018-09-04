$(function () {

    var table = document.getElementById("board");
    var sizeX = Math.floor($(window).width() / 20);
    var sizeY = Math.floor($(window).height() / 20);

    var symbolCircle = '<span class="circle"></span>';
    var symbolCross = '<span class="cross"></span>';
    var player = 0;

    //pomocne parametre vykresli hru do stredu hraceho pola
    var startPosition = {
        x: Math.floor(sizeX / 2) - 2,
        y: Math.floor(sizeY / 2) + 1
    };

    // ulozena nedokoncena hra
    var schema = [
        {x: startPosition.x, y: startPosition.y, p: 0},
        {x: startPosition.x, y: startPosition.y - 2, p: 1},
        {x: startPosition.x + 2, y: startPosition.y - 2, p: 0},
        {x: startPosition.x + 1, y: startPosition.y - 3, p: 1},
        {x: startPosition.x + 3, y: startPosition.y - 1, p: 0},
        {x: startPosition.x + 3, y: startPosition.y - 3, p: 1}
    ];

    var endGame = false;

    //zmazanie posledneho kroku po stlaceni backspace
    $(document).keyup(function (e) {
        if (endGame === false) {
            if (e.keyCode === 8) {
                schema.pop();
                makeSchema();
            }
        }
    });

    if (sizeX < 5 || sizeY < 5) {
        alert('Okno prehliadača je malé na uskutočnenie hry');
        return;
    }

    makeBoard(sizeX, sizeY);
    makeSchema();
    checkGame();

    $('.replay').on('click', function () {
        $(this).addClass('d-none');
        replayGame();
    });

    // prechadza hracim polom a vyhodnocuje hru
    function checkGame() {

        for (var i = 0, row; row = table.rows[i]; i++) {
            for (var j = 0, col; col = row.cells[j]; j++) {

                var posX0 = $(row.cells[j]).data("player");
                var posX1 = $(row.cells[j + 1]).data("player");
                var posX2 = $(row.cells[j + 2]).data("player");
                var posX3 = $(row.cells[j + 3]).data("player");
                var posX4 = $(row.cells[j + 4]).data("player");
                var posY0 = $(table.rows[i].cells[j]).data("player");

                //overenie zvyslo
                if ((i + 4) < table.rows.length && typeof posY0 !== "undefined" && typeof $(table.rows[i + 1].cells[j]).data("player") !== "undefined" && typeof $(table.rows[i + 2].cells[j]).data("player") !== "undefined" && typeof $(table.rows[i + 3].cells[j]).data("player") !== "undefined") {
                    if (
                        table.rows[i].cells[j].dataset.player === table.rows[i + 1].cells[j].dataset.player &&
                        table.rows[i + 1].cells[j].dataset.player === table.rows[i + 2].cells[j].dataset.player &&
                        table.rows[i + 2].cells[j].dataset.player === table.rows[i + 3].cells[j].dataset.player) {
                        if (table.rows[i + 3].cells[j].dataset.player === table.rows[i + 4].cells[j].dataset.player && typeof $(table.rows[i + 4].cells[j]).data("player") !== "undefined") {
                            // koniec hry po splneni pravidiel a urcenie vytaza
                            isWinner(table.rows[i].cells[j].dataset.player);
                            endGame = true;
                            // podfarbenie vytaznych symbolov
                            for (var s = 0; s < 5; s++) {
                                $(table.rows[i + s].cells[j]).css("background-color", "#D5FFDA");
                            }
                        } else {
                            // podfarbenie vyhernych krokov
                            if (!endGame) {
                                if (typeof table.rows[i + 4].cells[j].dataset.player === 'undefined') {
                                    $(table.rows[i + 4].cells[j]).css("background-color", playerHelp(player));
                                }
                                if (typeof table.rows[i - 1].cells[j].dataset.player === 'undefined') {
                                    $(table.rows[i - 1].cells[j]).css("background-color", playerHelp(player));
                                }
                            }
                        }
                    }
                }

                //overenie diagonalne
                if ((i + 4) < table.rows.length && typeof posY0 !== "undefined" && typeof $(table.rows[i + 1].cells[j + 1]).data("player") !== "undefined" && typeof $(table.rows[i + 2].cells[j + 2]).data("player") !== "undefined" && typeof $(table.rows[i + 3].cells[j + 3]).data("player") !== "undefined") {
                    if (
                        table.rows[i].cells[j].dataset.player === table.rows[i + 1].cells[j + 1].dataset.player &&
                        table.rows[i + 1].cells[j + 1].dataset.player === table.rows[i + 2].cells[j + 2].dataset.player &&
                        table.rows[i + 2].cells[j + 2].dataset.player === table.rows[i + 3].cells[j + 3].dataset.player) {
                        if (table.rows[i + 3].cells[j + 3].dataset.player === table.rows[i + 4].cells[j + 4].dataset.player && typeof $(table.rows[i + 4].cells[j + 4]).data("player") !== "undefined") {
                            isWinner(table.rows[i].cells[j].dataset.player);
                            endGame = true;
                            for (var s = 0; s < 5; s++) {
                                $(table.rows[i + s].cells[j + s]).css("background-color", "#D5FFDA");
                            }
                        } else {
                            if (!endGame) {
                                if (typeof table.rows[i + 4].cells[j + 4].dataset.player === 'undefined') {
                                    $(table.rows[i + 4].cells[j + 4]).css("background-color", playerHelp(player));
                                }
                                if (typeof table.rows[i - 1].cells[j - 1].dataset.player === 'undefined') {
                                    $(table.rows[i - 1].cells[j - 1]).css("background-color", playerHelp(player));
                                }
                            }
                        }
                    }
                }

                //overenie diagonalne
                if ((i + 4) < table.rows.length && typeof posY0 !== "undefined" && typeof table.rows[i + 1].cells[j - 1].dataset.player !== 'undefined' && typeof table.rows[i + 2].cells[j - 2].dataset.player !== 'undefined' && typeof table.rows[i + 3].cells[j - 3].dataset.player !== 'undefined') {
                    if (
                        table.rows[i].cells[j].dataset.player === table.rows[i + 1].cells[j - 1].dataset.player &&
                        table.rows[i + 1].cells[j - 1].dataset.player === table.rows[i + 2].cells[j - 2].dataset.player &&
                        table.rows[i + 2].cells[j - 2].dataset.player === table.rows[i + 3].cells[j - 3].dataset.player) {

                        if (table.rows[i + 3].cells[j - 3].dataset.player === table.rows[i + 4].cells[j - 4].dataset.player && typeof table.rows[i + 4].cells[j - 4].dataset.player !== 'undefined') {
                            isWinner(table.rows[i].cells[j].dataset.player);
                            endGame = true;
                            for (var s = 0; s < 5; s++) {
                                $(table.rows[i + s].cells[j - s]).css("background-color", "#D5FFDA");
                            }
                        } else {
                            if (!endGame) {
                                if (typeof table.rows[i + 4].cells[j - 4].dataset.player === 'undefined') {
                                    $(table.rows[i + 4].cells[j - 4]).css("background-color", playerHelp(player));
                                }
                                if (typeof table.rows[i - 1].cells[j + 1].dataset.player === 'undefined') {
                                    $(table.rows[i - 1].cells[j + 1]).css("background-color", playerHelp(player));
                                }
                            }
                        }
                    }
                }

                // overenie vodorovne
                if ((posX0 === posX1 && posX1 === posX2 && posX2 === posX3) && (typeof posX0 !== "undefined" && typeof posX1 !== "undefined" && typeof posX2 !== "undefined" && typeof posX3 !== "undefined")) {
                    if (posX3 === posX4 && typeof posX4 !== "undefined") {
                        endGame = true;
                        isWinner($(row.cells[j]).data("player"));
                        for (var s = 0; s < 5; s++) {
                            $(row.cells[j + s]).css("background-color", "#D5FFDA");
                        }
                    } else {
                        if (!endGame) {
                            if (typeof posX4 === "undefined") {
                                $(row.cells[j + 4]).css("background-color", playerHelp(player));
                            }
                            if (typeof $(row.cells[j - 1]).data("player") === "undefined") {
                                $(row.cells[j - 1]).css("background-color", playerHelp(player));
                            }
                        }
                    }
                }
            }
        }
    }


    function forEachAction(y, x, p) {
        $(table.rows[y].cells[x]).append(makeSymbol(p)).attr('data-player', p);
        nextPlayer(p);

    }

    // vyprazdni hracie pole
    function emptyBoard() {
        $("#board td").empty().attr('data-player', '').removeAttr("data-player").css("background-color", "#ffffff");
    }

    // vlozi do hracieho pola rozohranu hru
    function makeSchema() {
        emptyBoard();
        $.each(schema, function (key, value) {
            forEachAction(value.y, value.x, value.p);
        });
    }

    //prehranie celej hry
    function replayGame() {
        emptyBoard();
        var time = 1000;
        $.each(schema, function (key, value) {
            var isLast = key === schema.length - 1;
            play = setTimeout(function () {
                forEachAction(value.y, value.x, value.p);
                if (isLast) {
                    checkGame();
                }
            }, time);
            time += 1000;
        });
    }

    //vlozi symbol do pola podla hraca
    function makeSymbol(player) {
        if (player === 0) {
            return symbolCircle;
        } else {
            return symbolCross;
        }
    }

    // urci nasledujuceho hraca
    function nextPlayer(p) {
        if (p === 1) {
            player = 0;
        } else if (p === 0) {
            player = 1;
        }
    }

    // sfarbi pozadie
    function playerHelp(p) {
        if (p === 1) {
            var bgColor = '#FFD5D8';
        } else if (p === 0) {
            bgColor = '#D5FFDA';
        }
        return bgColor;
    }

    //polozenie symbolu na click
    $(this).on('click', 'td:not([data-player])', function () {
        if (endGame === false) {
            var parent = $(this).parent().index();
            var position = $(this).index();
            schema.push({x: position, y: parent, p: player});
            makeSchema();
            checkGame();
        }
    });
});

//zobrazenie spravy po ukonceni hry
function isWinner(player) {
    $("#board td").css("background-color", "#F7F7F7");
    if (player == 0) {
        var winText = 'Vyhral zelený hráč.';
        var winClass = 'bg-success'
    } else {
        winText = 'Vyhral červený hráč';
        winClass = 'bg-danger';
    }
    $('.win-table').removeClass('d-none').addClass('d-flex ' + winClass);
    $('.winner').text(winText);
    $('.replay').removeClass('d-none');
    $('#board').addClass('game-over');
}


//vytvorenie hracieho pola
function makeBoard(x, y) {
    var rowstart = '<tr>';
    var rowend = '</tr>';
    var cell = '<td></td>';
    var boardrow = rowstart;

    for (var i = 0; i < x; i++) {
        boardrow += cell;
    }
    boardrow += rowend;
    for (var c = 0; c < y; c++) {
        $('#board > tbody').append(boardrow);
    }
}