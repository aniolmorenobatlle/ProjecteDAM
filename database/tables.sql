-- Creació del tipus ENUM per a "status"
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_enum') THEN
        CREATE TYPE status_enum AS ENUM ('pending', 'accepted', 'rejected');
    END IF;
END$$;

-- Creació de les taules
CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  username VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  image VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title varchar,
  release_year date,
  poster varchar,
  cover varchar,
  synopsis text,
  vote_average DECIMAL(3, 1),
  director_id int,
  id_api int UNIQUE,
  created_at TIMESTAMP
);

CREATE TABLE actors (
  id SERIAL PRIMARY KEY,
  name varchar,
  image varchar,
  id_api int UNIQUE,
  created_at TIMESTAMP
);

CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name varchar,
  created_at TIMESTAMP
);

CREATE TABLE comment (
  id SERIAL PRIMARY KEY,
  user_id int,
  movie_id int,
  comment text,
  created_at TIMESTAMP
);

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  user_id int,
  movie_id int,
  rating DECIMAL(2,1) NOT NULL,
  created_at TIMESTAMP
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id int,
  friend_id int,
  movie_id int,
  status status_enum,
  created_at TIMESTAMP
);

CREATE TABLE friends (
  id SERIAL PRIMARY KEY,
  user_id int,
  friend_id int,
  status status_enum DEFAULT 'pending',
  created_at TIMESTAMP
);

CREATE TABLE to_watch (
  id SERIAL PRIMARY KEY,
  user_id int,
  movie_id int,
  likes boolean,
  watched boolean,
  created_at TIMESTAMP
);

CREATE TABLE lists (
  id SERIAL PRIMARY KEY,
  user_id int,
  name varchar,
  created_at TIMESTAMP
);

CREATE TABLE director (
  id SERIAL PRIMARY KEY,
  name varchar,
  id_api int UNIQUE,
  created_at TIMESTAMP
);

CREATE TABLE movie_list (
  id SERIAL PRIMARY KEY,
  list_id int,
  movie_id int,
  created_at TIMESTAMP
);

CREATE TABLE movies_actors (
  movie_id int,
  actor_id int,
  created_at TIMESTAMP,
  PRIMARY KEY (movie_id, actor_id)
);

CREATE TABLE movies_genres (
  movie_id int,
  genre_id int,
  created_at TIMESTAMP
);

CREATE TABLE chat (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP
);

CREATE TABLE user_chat (
  id SERIAL PRIMARY KEY,
  user_id int,
  chat_id int,
  created_at TIMESTAMP
);

CREATE TABLE message (
  id SERIAL PRIMARY KEY,
  chat_id int,
  user_id int,
  text text,
  timestamp TIMESTAMP,
  created_at TIMESTAMP
);

-- Afegir les claus foranes
ALTER TABLE comment ADD FOREIGN KEY (user_id) REFERENCES "user" (id);
ALTER TABLE comment ADD FOREIGN KEY (movie_id) REFERENCES movies (id);

ALTER TABLE ratings ADD FOREIGN KEY (user_id) REFERENCES "user" (id);
ALTER TABLE ratings ADD FOREIGN KEY (movie_id) REFERENCES movies (id);

ALTER TABLE notifications ADD FOREIGN KEY (user_id) REFERENCES "user" (id);
ALTER TABLE notifications ADD FOREIGN KEY (friend_id) REFERENCES "user" (id);
ALTER TABLE notifications ADD FOREIGN KEY (movie_id) REFERENCES movies (id);

ALTER TABLE friends ADD FOREIGN KEY (user_id) REFERENCES "user" (id);
ALTER TABLE friends ADD FOREIGN KEY (friend_id) REFERENCES "user" (id);

ALTER TABLE to_watch ADD FOREIGN KEY (user_id) REFERENCES "user" (id);
ALTER TABLE to_watch ADD FOREIGN KEY (movie_id) REFERENCES movies (id);

ALTER TABLE lists ADD FOREIGN KEY (user_id) REFERENCES "user" (id);

ALTER TABLE movies ADD CONSTRAINT fk_director FOREIGN KEY (director_id) REFERENCES director(id);

ALTER TABLE movie_list ADD FOREIGN KEY (list_id) REFERENCES lists (id);
ALTER TABLE movie_list ADD FOREIGN KEY (movie_id) REFERENCES movies (id);

ALTER TABLE movies_actors ADD FOREIGN KEY (movie_id) REFERENCES movies (id_api);
ALTER TABLE movies_actors ADD FOREIGN KEY (actor_id) REFERENCES actors (id);

ALTER TABLE movies_genres ADD FOREIGN KEY (movie_id) REFERENCES movies (id);
ALTER TABLE movies_genres ADD FOREIGN KEY (genre_id) REFERENCES genres (id);

ALTER TABLE user_chat ADD FOREIGN KEY (user_id) REFERENCES "user" (id);
ALTER TABLE user_chat ADD FOREIGN KEY (chat_id) REFERENCES chat (id);

ALTER TABLE message ADD FOREIGN KEY (chat_id) REFERENCES chat (id);
ALTER TABLE message ADD FOREIGN KEY (user_id) REFERENCES "user" (id);
