-- 0. prerequisites
create extension if not exists btree_gist;

alter table "BookingItem"
  add column period tsrange;

alter table "BookingItem"
  add constraint booking_item_no_overlap
  exclude using gist (
    "inventoryId" with =,
    period        with &&
  )
  where ("bookingStatus" in ('CONFIRMED','PENDING', 'HOLD'));   
