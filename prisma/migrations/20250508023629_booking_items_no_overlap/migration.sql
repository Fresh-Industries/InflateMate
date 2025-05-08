-- 0. prerequisites
create extension if not exists btree_gist;

create or replace function immutable_tsrange(timestamp, timestamp)
returns tsrange
language sql
immutable
as $$ select tsrange($1,$2); $$;

alter table "BookingItem"
  add column period tsrange
  generated always as (
    immutable_tsrange("startUTC","endUTC")
  ) stored;

alter table "BookingItem"
  add constraint booking_item_no_overlap
  exclude using gist (
    "inventoryId" with =,
    period        with &&
  )
  where ("bookingStatus" in ('CONFIRMED','PENDING'));   
