-- ENUM per a status de friends
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_enum') THEN
        CREATE TYPE status_enum AS ENUM ('pending', 'accepted', 'rejected');
    END IF;
END$$;

-- Taules
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  username VARCHAR NOT NULL UNIQUE,
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  avatar VARCHAR,
  poster TEXT,
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

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id int,
  movie_id int,
  comment text,
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
  user_id int NOT NULL,
  movie_id int NOT NULL,
  likes boolean,
  watched boolean,
  watchlist boolean,
  favorite boolean DEFAULT false,
  rating DECIMAL(2,1),
  created_at TIMESTAMP
);

CREATE TABLE lists (
  id SERIAL PRIMARY KEY,
  user_id int,
  name varchar,
  created_at TIMESTAMP
);

CREATE TABLE directors (
  id SERIAL PRIMARY KEY,
  name varchar,
  id_api int UNIQUE,
  created_at TIMESTAMP
);

CREATE TABLE streaming (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  logo VARCHAR,
  id_api INT UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movie_list (
  id SERIAL PRIMARY KEY,
  list_id int,
  movie_id int,
  created_at TIMESTAMP
);

CREATE TABLE movies_streaming (
  movie_id INT,
  streaming_id INT,
  display_priority INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (movie_id, streaming_id),
  FOREIGN KEY (movie_id) REFERENCES movies (id_api),
  FOREIGN KEY (streaming_id) REFERENCES streaming (id_api)
);

CREATE TABLE movies_actors (
  movie_id int,
  actor_id int,
  "order" int,
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

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  chat_id int,
  user_id int,
  text text,
  timestamp TIMESTAMP,
  created_at TIMESTAMP
);

-- Relacions i claus foranees
ALTER TABLE comments ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE comments ADD FOREIGN KEY (movie_id) REFERENCES movies (id_api);

ALTER TABLE notifications ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE notifications ADD FOREIGN KEY (friend_id) REFERENCES users (id);
ALTER TABLE notifications ADD FOREIGN KEY (movie_id) REFERENCES movies (id);

ALTER TABLE friends ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE friends ADD FOREIGN KEY (friend_id) REFERENCES users (id);

ALTER TABLE to_watch ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE to_watch ADD FOREIGN KEY (movie_id) REFERENCES movies (id_api);
CREATE UNIQUE INDEX to_watch_user_movie_idx ON to_watch(user_id, movie_id);

ALTER TABLE lists ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE movies ADD CONSTRAINT fk_director FOREIGN KEY (director_id) REFERENCES directors(id);

ALTER TABLE movie_list ADD FOREIGN KEY (list_id) REFERENCES lists (id);
ALTER TABLE movie_list ADD FOREIGN KEY (movie_id) REFERENCES movies (id_api) ON DELETE CASCADE;

ALTER TABLE movies_actors ADD FOREIGN KEY (movie_id) REFERENCES movies (id_api);
ALTER TABLE movies_actors ADD FOREIGN KEY (actor_id) REFERENCES actors (id);

ALTER TABLE movies_genres ADD FOREIGN KEY (movie_id) REFERENCES movies (id);
ALTER TABLE movies_genres ADD FOREIGN KEY (genre_id) REFERENCES genres (id);

ALTER TABLE user_chat ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE user_chat ADD FOREIGN KEY (chat_id) REFERENCES chat (id);

ALTER TABLE messages ADD FOREIGN KEY (chat_id) REFERENCES chat (id);
ALTER TABLE messages ADD FOREIGN KEY (user_id) REFERENCES users (id);
