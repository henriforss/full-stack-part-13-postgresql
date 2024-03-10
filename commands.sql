-- Create a new table
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    url VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    likes INTEGER DEFAULT 0
);

-- Insert a new row
INSERT INTO blogs (author, url, title) 
VALUES ('Ville Moi', 'https://blogi.fi/moikka', 'Jeeba jee!');

-- Insert a second row
INSERT INTO blogs (author, url, title)
VALUES ('Bingo', 'https://bingo.com/ciao', 'Jees no joo');

-- Select all rows
SELECT * FROM blogs;