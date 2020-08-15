# Distributed Pizza

## This adds distribution capabilities to a websocket server that dishes out pizza

- The websocket server runs when a connection is created to it.
- The websocket server will then start spawning stores and orders, which are to be fulfilled.
- Unfortunately, sometimes the stores will be struck by a natural disaster, and not be able to fulfill their order.
- Stores will also randomly spawn themselves.
- The orders will be made to a postgres server in the background.

## Using Postgres Leader Follower replication

- To setup Leader follower replication, make sure to point your `.env` file in `prisma/` to the correct database, and run `yarn migrate` to apply the migration to create the `orders` table.
- Run `pg_basebackup -h 127.0.0.1 -U follower -p 5433 -D databases/follower_2 -P -Xs -R` and `pg_basebackup -h 127.0.0.1 -U follower -p 5433 -D databases/follower_1 -P -Xs -R` to sync up the leader to its followers.
- Now, go to `orders/index.ts` and set the db to the leader's connection string.
- After starting the app with `yarn watch`, the app will run.
- Open a tab with Weasel, and open it to `ws://localhost:3000`.
- Check the tables to make sure that the replication is working properly.
- Unfortunately, this doesn't do leader election for us, so if we kill the leader, then the app doesn't know what database to talk to.

## Using Patroni for distribution

- We can use patroni for distribution, and creating a single url to talk to.
- Start etcd in a terminal with `yarn etcd:start`
- Start the first postgres instance in a different terminal window with `yarn pg0:start`
- Start the second one with `yarn pg1:start`
- Start the third one with `yarn pg2:start`
- Start haproxy (which will be the instance we connect to) with `haproxy:start`.
- Now we can kill our instances off randomly and it won't matter, since they will be managed by etcd and replicate through postgres.

