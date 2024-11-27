-- rename and set constraints in properties
ALTER TABLE properties 
  RENAME COLUMN weight TO atomic_mass;
ALTER TABLE properties 
  RENAME COLUMN melting_point TO melting_point_celsius;
ALTER TABLE properties 
  RENAME COLUMN boiling_point TO boiling_point_celsius;
ALTER TABLE properties 
  ALTER COLUMN melting_point_celsius SET NOT NULL,
  ALTER COLUMN boiling_point_celsius SET NOT NULL;

-- set elements table constraints
ALTER TABLE elements 
  ADD UNIQUE (name),
  ADD UNIQUE (symbol),
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN symbol SET NOT NULL;

-- set foreign key in properties.atomic_number
ALTER TABLE properties
  ADD FOREIGN KEY (atomic_number) REFERENCES elements(atomic_number);

-- remove false entry
DELETE FROM properties
  WHERE atomic_number = 1000;
DELETE FROM elements 
  WHERE atomic_number = 1000;

-- create new types table
CREATE TABLE types (
  type_id SERIAL PRIMARY KEY,
  type VARCHAR(25) NOT NULL
);

-- get rows for types table
INSERT INTO types (
  type
)
SELECT DISTINCT type 
  FROM properties;

-- set properties.type_id foreign key
ALTER TABLE properties
  ADD COLUMN type_id INT,
  ADD FOREIGN KEY (type_id) REFERENCES types(type_id);

-- add the entries to properties.type_id
-- from new types table.
-- could work with a single update, with a join?
DO
$$
DECLARE
  t record;
BEGIN
  FOR t IN SELECT type, type_id
    FROM types
  LOOP
    UPDATE properties
      SET type_id = (
        SELECT type_id
        FROM types
        WHERE type_id = t.type_id
      )
      WHERE type = t.type;
  END LOOP;
END;
$$;

-- set properties.type_id to null
ALTER TABLE properties 
  ALTER COLUMN type_id SET NOT NULL;

-- remove type column from properties
ALTER TABLE properties
  DROP COLUMN type;

-- uppercase symbols in elements.symbol
UPDATE elements
  SET symbol = INITCAP(symbol);


-- remove trailing zeroes in properties.atomic_mass
ALTER TABLE properties 
  ALTER COLUMN atomic_mass TYPE DECIMAL(999, 4);
-- TODO:
UPDATE properties 
  SET weight = TRIM_SCALE(weight) 
