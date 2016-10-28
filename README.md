# Module 2 group project #
__Submitted by:__ _nothingspecial_

__Team members:__

- chen4656@umn.edu
- grin0098@umn.edu
- lixx3524@umn.edu
- nixxx169@umn.edu
- tangx668@umn.edu


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

- API
See API.md.

__Argument of execution:__

- User join game
In order to play the game, players have to set a username and then start playing. All players will join
the same game if a game has already started.

- Initial gameboard
A new game starts with initializing two game boards, each time a new game starts, the game boards will display
different colors. Human ship board will have some blocks in grey to indicate the positions with ships.

- Play the game
During a game session, all players in the team vote for the position to hit on the computer ship board. Voting
is easily done by click the position in the computer game board.If one player executes spam voting, e.g.clicking
the same position continuouly, all other players will find out through the logs.

- Swith to spectator view
If a player wants to switch out to spectator mode, he can switch through `spectator` to leave the game board. 
And he can return to play by click the `play` button which will require him to input a username to join again.

- Check game history
Statistics page provides the game history and the hit accuracy of both human and computer.

- End of game
Computer or human hit sink all the ships on the opponent's board, and become the winner.


## Description ##
For this module you will be making a multi-user, online game using Express,
WebSockets, and MongoDB. Your final product will need to have these components:

- An API that can be used to get information about the current state of the
  the game and post moves to the game. This will be how the game can be played.
- A view to watch the game in real time.
- A statistics page for the game.

### What constitutes a game? ###
Google says that the definition of "game" is "a form of play or sport" and who
are we to argue with Google. You could do something relatively simple like
[Twitch Plays Tic-tac-toe](https://en.wikipedia.org/wiki/Twitch_Plays_Pok%C3%A9mon)
to something as complicated as your own
[MUD](https://en.wikipedia.org/wiki/MUD). It doesn't need to be elaborate or
highly visual.

### API: Playing the game ###
You need to write an web API that will let people easily write clients to play your
game. Suppose our game is [tug-of-war](https://en.wikipedia.org/wiki/Tug_of_war).
Then I would want to be able to get `/rope-position` for information about the
current position of the rope in
[JSON format](https://en.wikipedia.org/wiki/JSON) and post to `/pull-on-left`
or `/pull-on-right` to affect the state of the game.

You will need to develop a set of tools, scripts, or code that will test and
demonstrate the capabilities of your API. You can use whatever languages you
want to accomplish this. Both
[node.js](http://stackoverflow.com/questions/5643321/how-to-make-remote-rest-call-inside-node-js-any-curl/5643366#5643366)
and
[python](http://stackoverflow.com/questions/4476373/simple-url-get-post-function-in-python)
are capable of this. There is a good chance your favorite language can do it
also.

If you just want to poke at your API a little bit you can use tools like
[Postman](https://www.getpostman.com/) and
[Advanced REST client](https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo?hl=en-US)
as in browser options or
[curl](https://curl.haxx.se/docs/manpage.html) on the command line.
Curl has the benefit that it is available on almost all systems.

### Watching the game ###
Create a view for spectators. Your players will be interacting via your API,
but you should also have a way for spectators to watch via a webpage. This
should update in real time, so you will need to use WebSockets to push
events out to the UI.

What you display here is up to your own judgment, just make sure it is
something worth watching. If you were doing tic-tac-toe, I would want to watch
as the board fills up. If you were doing hangman, I would want to see the
gallows being built. You don't need fancy graphics, just provide some way of
conveying action.

Other potential options:

- twitter-like stream of events
- scoreboard
- live-updating charts


### Stats overview ###
The final requirement is some statistics web page for the game. This can be
displaying the number of times a person took a specific action, the amount of
time that it took a game to finish, et cetera. Show any statistics that you
think would be interesting for your specific game. You can make this static or
use web sockets to update content live here.

## Setting up your database ##
Someone from each group should create an account with [mLab](https://mlab.com/)
and setup a free sandbox database. This will be the database you should use for
your project. __If you want to connect from inside the UMN you should send us
the URI they gave you.__ We will then send you back a URI you can use to
connect.

### The reasoning (in case you want to know) ###
The reason you need to do this is that the UMN network blocks certain outgoing
ports. These are also the ports that mLab uses to let you connect. We have a
server outside of UMN that listens on ports that are not blocked and will
forward your traffic on to mLab.

## Submission ##
- Your code should be pushed up to your repo on github
- Fill this `README.md` out with your team name, team members' emails, and
  Heroku url for your demo. Additionally, complete the argument sections at the
  top of the file.
- Create a file called `API.md` that documents your api endpoints and how to
  use them. These should include a valid `curl` command and a description of its
  expected output.

## Grading ##
You will be graded on the __ambition__ and __execution__ of the project. At
the top of this `README.md` you have the opportunity to argue why your
submission was ambitious and well executed. In order for us to grade it, you
must have it hosted on Heroku. To earn an "A" grade, a project must be
technically ambitious, well-executed, and polished. To earn a passing grade, a
project must minimally fulfill the three requirements listed in the description.
