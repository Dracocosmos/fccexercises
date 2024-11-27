#! /bin/bash

PSQL="psql --username=freecodecamp --dbname=periodic_table -t --no-align -c"

# if no arguments given
if [[ -z $1 ]]
then
  echo "Please provide an element as an argument."
  exit
fi

# check if number
re='^[0-9]+$'
if [[ $1 =~ $re ]] ; 
then
  # then look for numbers in db
  A_NUMBER_RESULT=$($PSQL "SELECT atomic_number, atomic_mass, melting_point_celsius, boiling_point_celsius, symbol, name, type FROM properties JOIN elements USING (atomic_number) JOIN types USING (type_id) WHERE atomic_number = $1")
else
  # else look for anything that's a letter
  SYMBOL_RESULT=$($PSQL "SELECT atomic_number, atomic_mass, melting_point_celsius, boiling_point_celsius, symbol, name, type FROM properties JOIN elements USING (atomic_number) JOIN types USING (type_id) WHERE symbol = '$1'")
  NAME_RESULT=$($PSQL "SELECT atomic_number, atomic_mass, melting_point_celsius, boiling_point_celsius, symbol, name, type FROM properties JOIN elements USING (atomic_number) JOIN types USING (type_id)  WHERE name = '$1'")
fi

# set result
if ! [[ -z $A_NUMBER_RESULT ]]
then
  RESULT=$A_NUMBER_RESULT
fi
if ! [[ -z $SYMBOL_RESULT ]]
then
  RESULT=$SYMBOL_RESULT
fi
if ! [[ -z $NAME_RESULT ]]
then
  RESULT=$NAME_RESULT
fi

# if no result found
if [[ -z $RESULT ]]
then
  echo "I could not find that element in the database."
  exit
fi

IFS="|" read A_NUMBER A_MASS M_POINT B_POINT SYMBOL NAME TYPE <<< $(echo $RESULT)

# echo $A_NUMBER $A_MASS $M_POINT $B_POINT $SYMBOL $NAME $TYPE
echo "The element with atomic number $A_NUMBER is $NAME ($SYMBOL). It's a $TYPE, with a mass of $A_MASS amu. $NAME has a melting point of $M_POINT celsius and a boiling point of $B_POINT celsius."