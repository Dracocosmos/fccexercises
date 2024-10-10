DROP TABLE customers;
DROP TABLE appointments;
DROP TABLE services;

CREATE TABLE customers (
  customer_id SERIAL PRIMARY KEY,
  phone VARCHAR(25) UNIQUE,
  name VARCHAR(40)
);

CREATE TABLE services (
  service_id SERIAL PRIMARY KEY,
  name VARCHAR(40)
);

CREATE TABLE appointments (
  appointment_id SERIAL PRIMARY KEY,
  customer_id INT, 
  service_id INT,
  time VARCHAR(20),
  FOREIGN KEY(customer_id) REFERENCES customers(customer_id),
  FOREIGN KEY(service_id) REFERENCES services(service_id)
);

INSERT INTO services (
  name
) VALUES ( 
  'cut'
),
(
  'wash'
),
(
  'shave'
);
