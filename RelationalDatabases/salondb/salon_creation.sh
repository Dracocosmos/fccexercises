#! /bin/bash

PSQL="psql -t -A --csv --username=freecodecamp --dbname=salon -c"

MAIN_MENU() {
  echo -e "\n$1\n"

  SERVICES_LIST="$($PSQL "SELECT * FROM services")"

  # list of valid service choices
  # declare -a CHOISES_ARR
  CHOISES_ARR=()

  # go through service list one line at a time "$SERVICES_LIST",
  # do not pipe it to loop, it does not set variables inside loop if you do that
  # redirect temp file <<< instead, read to variables
  while IFS="," read SID TEXT
  do
    echo "$SID) $TEXT"
    # add a valid choice
    CHOISES_ARR+=("$SID")
  done <<< $( echo "$SERVICES_LIST" )

  # read user choice
  echo -e "\nPlease input service number:"
  read SERVICE_ID_SELECTED

  # if user choice not in list
  if (( ! $(echo ${CHOISES_ARR[@]} | grep -ow "$SERVICE_ID_SELECTED" | wc -w) ))
  then
    MAIN_MENU "Please use numerals given in your choice"
    return
  fi

  # read customer phone number
  echo -e "\nPlease input your phone number:"
  read CUSTOMER_PHONE

  # get customer info
  IFS="," read TEMP_ID TEMP_PHONE TEMP_NAME <<< "$($PSQL "SELECT * FROM customers WHERE phone = '$CUSTOMER_PHONE'")"

  # if customer not in db
  if [[ -z $TEMP_ID ]]
  then
    # get customer name
    echo -e '\nPlease input your name:'
    read CUSTOMER_NAME

    # add customer to db
    $PSQL "INSERT INTO customers(phone, name) VALUES('$CUSTOMER_PHONE', '$CUSTOMER_NAME')"
    IFS="," read TEMP_ID TEMP_PHONE TEMP_NAME <<< "$($PSQL "SELECT * FROM customers WHERE phone = '$CUSTOMER_PHONE'")"
  fi

  # set values to the ones got from the database
  CUSTOMER_ID=$TEMP_ID
  CUSTOMER_PHONE=$TEMP_PHONE
  CUSTOMER_NAME=$TEMP_NAME

  # Get time for service
  echo -e '\nPlease input time of service:'
  read SERVICE_TIME

  # add row to appointments
  $PSQL "INSERT INTO appointments(customer_id, service_id, time) VALUES($CUSTOMER_ID, $SERVICE_ID_SELECTED, '$SERVICE_TIME')" 

  SERVICE_TITLE=$($PSQL "SELECT name FROM services WHERE service_id = $SERVICE_ID_SELECTED")
  echo "I have put you down for a $SERVICE_TITLE at $SERVICE_TIME, $CUSTOMER_NAME."
  # echo "CUSTOMER_ID $CUSTOMER_ID - CUSTOMER_PHONE $CUSTOMER_PHONE - CUSTOMER_NAME $CUSTOMER_NAME - SERVICE_TIME $SERVICE_TIME"
}

MAIN_MENU "~~ Welcome, Choose a service ~~"
