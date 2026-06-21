-- Schema for Nexaroth demo backend

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE
);

CREATE TABLE balances (
  user_id TEXT PRIMARY KEY,
  vote INTEGER DEFAULT 0,
  donation INTEGER DEFAULT 0
);

CREATE TABLE items (
  id TEXT PRIMARY KEY,
  name TEXT,
  description TEXT,
  price_vote INTEGER DEFAULT 0,
  price_donate INTEGER DEFAULT 0
);
