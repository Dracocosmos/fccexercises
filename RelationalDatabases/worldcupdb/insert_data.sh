#! /bin/bash

if [[ $1 == "test" ]]
then
  PSQL="psql --username=postgres --dbname=worldcuptest -t --no-align -c"
else
  PSQL="psql --username=freecodecamp --dbname=worldcup -t --no-align -c"
fi

# Do not change code above this line. Use the PSQL variable above to query your database.

# Delete old data
"$($PSQL "TRUNCATE TABLE games, teams;")"

# go through testgames.csv one line at a time, set global variable IFS(field separator) to comma,
# and name comma separated values as variables
cat games.csv | while IFS="," read YEAR ROUND WINNER OPPONENT W_GOALS O_GOALS
do
  #skip first line
  if [[ $YEAR == 'year' ]]
  then
    continue
  fi

  # Get ids for teams
  W_ID=$($PSQL"
    SELECT team_id FROM teams WHERE name = '$WINNER';
  ")
  O_ID=$($PSQL"
    SELECT team_id FROM teams WHERE name = '$OPPONENT';
  ")

  # Add teams to tables
  add_to_teams_table () {
    # $1=name, returns new id
    $PSQL "INSERT INTO teams(name) VALUES ('$1')"
    # TEMPID so I can move the ID to W_ID or O_ID
    TEMPID=$($PSQL"
      SELECT team_id FROM teams WHERE name = '$1';
    ")
  }

  # if ids empty, add to teams
  if [[ -z $W_ID ]]
  then
    add_to_teams_table "$WINNER"
    W_ID=$TEMPID
  fi
  if [[ -z $O_ID ]]
  then
    add_to_teams_table "$OPPONENT"
    O_ID=$TEMPID
  fi

  # Add game to games table
  $PSQL "
    INSERT INTO games(year, round, winner_id, opponent_id, winner_goals, opponent_goals) 
      VALUES ($YEAR, '$ROUND', $W_ID, $O_ID, $W_GOALS, $O_GOALS);
    "

  # echo $O_ID, $W_ID
  # echo y:$YEAR r:$ROUND w:$WINNER o:$OPPONENT wg:$W_GOALS og:$O_GOALS
done

