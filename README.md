__Team members:__

- Yangyang Tang: tangx668@umn.edu
- Xi Chen      : chen4656@umn.edu
- Vas Grin     : grin0098@umn.edu
- Yangyun Li   : lixx3524@umn.edu
- Wei Ni       : nixxx169@umn.edu


__Heroku URL:__ https://thebattleship.herokuapp.com/

__Argument of ambition:__

_Our project is aiming to complete a Battleship game which will let a team play with the computer._
Compared to traditional play mode of Battleship, which is one player versus computer, we increased the
challenge level of the game by enabling multiple players versus computer. Under this mode, the game becomes
more interesting and requires team cooperation, this is one of the important technical challenges of our project.
We also try to maintain a clean and nice layout for our game which is completed in our css file.

- Battleship's inherent difficulty

Compared to other games, battleship has more restrictions on the settings of game board(i.e. display, size).
Each game has a lot of state statuses to keep in record. This increases the complexity of the communicaction 
between the server-side and client-side. Complicated communication format is needed.


- Computer AI

In order to increase the fun of the game, and let players feel quite challenging when playing with the computer,
battleship AI algorithm can not be too simple. We tried a variety of algorithms, and finally we referred to the 
algorithm here http://jsfiddle.net/FgbAK/.


- Multiple player VS Computer

To enable multiple players versus computer AI, the server needs to control computer AI and human players operations 
in turn. This increase the control complexity of the server-side. 
Human players vote for the position to hit on the computer ship board, hit operation will be executed to the 
position with the highest votings every 3 seconds. Different colors are used to show the result of each hit, green 
means hit miss, red means hit but not sink, black means hit sink.


- Username required

Everyone who wants to play the game needs to set a username and start the game. If no username input, alert show up
to require a username. If someone just want to watch the game, he can go to the `/spectator` view directly.


- Game logs

While during the game, game logs keep a record of votings from each players and the hit position of computer and human
every 3 seconds.


- Spectator view

Under spectator view, users can only watch the game, they are not allowed to vote. If anyone tries to vote, the operation
won't be valid. Users can easily swith to join the game by the link play.


- Statistics of game history

After each game finished, recording the winner of the game, and the accuracy of both human and computer in the database. 
Statistics keeps a game history.


__How to Play:__

- User join game

In order to play the game, players have to set a username and then start playing. All players will join
the same game, starting a new game or join an existing game if a game has already started.


- Initial gameboard

A new game starts with initializing two game boards, each time a new game starts, the game boards will display
different colors. Human ship board will have some blocks in grey to indicate the positions with ships.


- Play the game

During a game session, all players in the team vote for the position to hit on the computer ship board. Voting
is easily done by click the position in the computer game board.If one player executes spam voting, e.g.clicking
the same position continuouly, all other players will find out through the logs.


- Swith to spectator view

If a player wants to switch out to spectator mode, he can switch through `spectator` button to leave the game board. 
And he can return to play by click the `play` button which will require him to input a username to join again.


- Check game history

Statistics page provides the game history and the hit accuracy of both human and computer.


- End of game

Computer or human hit sink all the ships on the opponent's board, and become the winner.
