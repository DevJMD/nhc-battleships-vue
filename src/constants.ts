export enum GAME_MESSAGES {
    SHIP_HIT = '%s was a hit at %s!',
    SHIP_MISS = '%s was a miss... Try again!',
    SHIP_SUNK = 'You sunk a %s!',
    ALL_SHIPS_SUNK = '🥳 Congratulations! You sank all the ships. You win!',
    COORDINATE_OUT_OF_BOUNDS = 'Invalid coordinate. Please enter a valid coordinate between A1 and %s.',
    COORDINATE_ALREADY_FIRED = 'You\'ve already fired at that coordinate.',
    GAME_STARTED = '🚀 Game started! Enter a coordinate (you can type anywhere from A1 to %s%s) to fire at a ship.',
    GAME_OVER = 'Game over! Feel free to start a new game.',
}
