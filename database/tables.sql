-- Creació del tipus ENUM per a "status"
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_enum') THEN
        CREATE TYPE status_enum AS ENUM ('pending', 'accepted', 'rejected');
    END IF;
END$$;

-- Creació de les taules
CREATE TABLE "User" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR NOT NULL,
  "email" VARCHAR NOT NULL UNIQUE,
  "password" VARCHAR NOT NULL,
  "image" VARCHAR,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Movies" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "release_year" int,
  "cover" varchar,
  "cover2" varchar,
  "synopsis" text,
  "director_id" int,
  "popularity", NUMERIC DEFAULT 0,
  "created_at" TIMESTAMP
);

CREATE TABLE "Actors" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "surname" varchar,
  "image" varchar,
  "created_at" TIMESTAMP
);

CREATE TABLE "Genres" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "created_at" TIMESTAMP
);

CREATE TABLE "Comment" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "movie_id" int,
  "comment" text,
  "created_at" TIMESTAMP
);

CREATE TABLE "Ratings" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "movie_id" int,
  "rating" DECIMAL(2,1) NOT NULL,
  "created_at" TIMESTAMP
);

CREATE TABLE "Notifications" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "friend_id" int,
  "movie_id" int,
  "status" status_enum,
  "created_at" TIMESTAMP
);

CREATE TABLE "Friends" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "friend_id" int,
  "status" status_enum DEFAULT 'pending',
  "created_at" TIMESTAMP
);

CREATE TABLE "To_Watch" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "movie_id" int,
  "likes" boolean,
  "watched" boolean,
  "created_at" TIMESTAMP
);

CREATE TABLE "Lists" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "name" varchar,
  "created_at" TIMESTAMP
);

CREATE TABLE "Director" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar,
  "surname" varchar,
  "created_at" TIMESTAMP
);

CREATE TABLE "Movie_List" (
  "id" SERIAL PRIMARY KEY,
  "list_id" int,
  "movie_id" int,
  "created_at" TIMESTAMP
);

CREATE TABLE "Movies_Actors" (
  "movie_id" int,
  "actor_id" int,
  "created_at" TIMESTAMP,
  PRIMARY KEY ("movie_id", "actor_id")
);

CREATE TABLE "Movies_Genres" (
  "movie_id" int,
  "genre_id" int,
  "created_at" TIMESTAMP
);

CREATE TABLE "Chat" (
  "id" SERIAL PRIMARY KEY,
  "created_at" TIMESTAMP
);

CREATE TABLE "User_Chat" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "chat_id" int,
  "created_at" TIMESTAMP
);

CREATE TABLE "Message" (
  "id" SERIAL PRIMARY KEY,
  "chat_id" int,
  "user_id" int,
  "text" text,
  "timestamp" TIMESTAMP,
  "created_at" TIMESTAMP
);

-- Afegir les claus foranes
ALTER TABLE "Comment" ADD FOREIGN KEY ("user_id") REFERENCES "User" ("id");
ALTER TABLE "Comment" ADD FOREIGN KEY ("movie_id") REFERENCES "Movies" ("id");

ALTER TABLE "Ratings" ADD FOREIGN KEY ("user_id") REFERENCES "User" ("id");
ALTER TABLE "Ratings" ADD FOREIGN KEY ("movie_id") REFERENCES "Movies" ("id");

ALTER TABLE "Notifications" ADD FOREIGN KEY ("user_id") REFERENCES "User" ("id");
ALTER TABLE "Notifications" ADD FOREIGN KEY ("friend_id") REFERENCES "User" ("id");
ALTER TABLE "Notifications" ADD FOREIGN KEY ("movie_id") REFERENCES "Movies" ("id");

ALTER TABLE "Friends" ADD FOREIGN KEY ("user_id") REFERENCES "User" ("id");
ALTER TABLE "Friends" ADD FOREIGN KEY ("friend_id") REFERENCES "User" ("id");

ALTER TABLE "To_Watch" ADD FOREIGN KEY ("user_id") REFERENCES "User" ("id");
ALTER TABLE "To_Watch" ADD FOREIGN KEY ("movie_id") REFERENCES "Movies" ("id");

ALTER TABLE "Lists" ADD FOREIGN KEY ("user_id") REFERENCES "User" ("id");

ALTER TABLE "Movie_List" ADD FOREIGN KEY ("list_id") REFERENCES "Lists" ("id");
ALTER TABLE "Movie_List" ADD FOREIGN KEY ("movie_id") REFERENCES "Movies" ("id");

ALTER TABLE "Director" ADD FOREIGN KEY ("id") REFERENCES "Movies" ("director_id");

ALTER TABLE "Movies_Actors" ADD FOREIGN KEY ("movie_id") REFERENCES "Movies" ("id");
ALTER TABLE "Movies_Actors" ADD FOREIGN KEY ("actor_id") REFERENCES "Actors" ("id");

ALTER TABLE "Movies_Genres" ADD FOREIGN KEY ("movie_id") REFERENCES "Movies" ("id");
ALTER TABLE "Movies_Genres" ADD FOREIGN KEY ("genre_id") REFERENCES "Genres" ("id");

ALTER TABLE "User_Chat" ADD FOREIGN KEY ("user_id") REFERENCES "User" ("id");
ALTER TABLE "User_Chat" ADD FOREIGN KEY ("chat_id") REFERENCES "Chat" ("id");

ALTER TABLE "Message" ADD FOREIGN KEY ("chat_id") REFERENCES "Chat" ("id");
ALTER TABLE "Message" ADD FOREIGN KEY ("user_id") REFERENCES "User" ("id");
