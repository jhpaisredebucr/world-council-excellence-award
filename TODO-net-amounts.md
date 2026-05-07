# Net amount for deposits/withdrawals

- [ ] Add DB columns for net amount + withdrawal total deduction
- [ ] Update member deposit POST to persist `net_amount`
- [ ] Update member withdrawal POST to persist `net_amount` and `total_deduction`
- [ ] Update admin deposit approval to credit `net_amount` (not gross amount)
- [ ] Update admin withdrawal reject to refund `total_deduction` (not `amount`)
- [ ] (Optional) Update admin modals to show net amount/fee consistently

