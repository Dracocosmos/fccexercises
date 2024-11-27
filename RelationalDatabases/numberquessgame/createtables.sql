-- Table columns:
--
-- username
-- games played
-- best game
CREATE DATABASE numbergame;

CREATE TABLE users (
  uid SERIAL PRIMARY KEY,
  username VARCHAR(30) NOT NULL,
  games_total INT NOT NULL DEFAULT(0),
  best_game INT
);

