# TODO

- [ ] Add **net amount** handling for deposits and withdrawals so admin approval credits/debits the correct amount after processing fees.
- [ ] Update API payloads and transaction records to persist `net_amount` (and related fields) instead of using raw `amount`.
- [ ] Update admin approve/reject logic to use persisted `net_amount` for balance updates.
- [ ] Update any UI/admin modals to display net amount where relevant.
- [ ] Run quick sanity check (lint/build or targeted tests) if available.
- [x] DB SQL prepared: add-netamount-columns.sql


