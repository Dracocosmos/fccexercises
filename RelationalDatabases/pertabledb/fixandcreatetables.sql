ALTER TABLE properties 
  RENAME COLUMN weight TO atomic_mass;
ALTER TABLE properties 
  RENAME COLUMN melting_point TO melting_point_celsius;
ALTER TABLE properties 
  RENAME COLUMN boiling_point TO boiling_point_celsius;
ALTER TABLE properties 
  ALTER COLUMN melting_point_celsius SET NOT NULL,
  ALTER COLUMN boiling_point_celsius SET NOT NULL;

ALTER TABLE elements 
  ADD UNIQUE (name),
  ADD UNIQUE (symbol),
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN symbol SET NOT NULL;

ALTER TABLE properties
  ADD FOREIGN KEY (atomic_number) REFERENCES elements(atomic_number);

DELETE FROM properties
  WHERE atomic_number = 1000;

DELETE FROM elements 
  WHERE atomic_number = 1000;

CREATE TABLE types (
  type_id SERIAL PRIMARY KEY,
  type VARCHAR(25) NOT NULL
);

INSERT INTO types (
  type
)
SELECT DISTINCT type 
  FROM properties;

ALTER TABLE properties
  ADD COLUMN type_id INT,
  ADD FOREIGN KEY (type_id) REFERENCES types(type_id);

-- add the entries, then make not null
UPDATE properties 
  SET type_id = 
  WHERE;

ALTER TABLE properties 
  ALTER COLUMN type_id SET NOT NULL,

-- do last
ALTER TABLE properties
  DROP COLUMN type;
