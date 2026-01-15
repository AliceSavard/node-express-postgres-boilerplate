CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public."user" (
    "id" SERIAL NOT NULL,
    "name" varchar (25) NOT NULL,
    "email" varchar (50) UNIQUE NOT NULL,
    "tier" integer NOT NULL,
    "token_version" integer NOT NULL DEFAULT 0,
    "created_date_time" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_date_time" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" varchar NOT NULL,
    PRIMARY KEY ("id")
);

COMMENT ON COLUMN public."user"."token_version" IS 'Incremented on logout, password change, or account compromise to invalidate all existing JWTs';
