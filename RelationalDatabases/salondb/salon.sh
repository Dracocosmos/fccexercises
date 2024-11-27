#! /bin/bash

PSQL="psql -t -A --csv --username=freecodecamp --dbname=salon -c"

MAIN_MENU() {
  echo -e "\n$1\n"

  SERVICES_LIST="$($PSQL "SELECT * FROM services")"

  # list of valid service choices
  # declare -a CHOISES_ARR
  CHOISES_ARR=()

  # go through service list one line at a time "$SERVICES_LIST",
  # pipe it to loop, read to variables
  while IFS="," read SID TEXT
  do
    echo "$SID) $TEXT"
    # add a valid choice
    CHOISES_ARR+=("$SID")

  done <<< $( echo "$SERVICES_LIST" )

  # read user choice
  echo -e "\nPlease input you choice:"
  read SERVICE_CHOICE

  # if user choice in list
  if (( $(echo ${CHOISES_ARR[@]} | grep -ow "$SERVICE_CHOICE" | wc -w) ))
  then
    echo 'hi'
  # if not in list
  else
    MAIN_MENU "Please use numerals given in your choice"
  fi
}

MAIN_MENU "~~ Welcome, Choose a service ~~"
