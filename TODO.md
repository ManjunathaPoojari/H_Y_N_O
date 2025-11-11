# TODO: Fix Order Creation Issues

## Issues to Resolve
- [x] Data type mismatch: deliveryAddress sent as object but expected as JSON string
- [x] Database constraint mismatch: patient_id nullable in entity but NOT NULL in DB
- [x] Port conflict: Backend port 8081 in use

## Tasks
- [x] Fix deliveryAddress JSON serialization in PharmacyCheckout.tsx
- [x] Update Order entity to make patient_id non-nullable
- [x] Change backend port from 8081 to 8082 in application.properties
- [x] Start backend on new port (running successfully on port 8082)
- [x] Update frontend config to use port 8082
- [x] Start frontend on port 3001
- [ ] Test order creation end-to-end
- [ ] Verify API endpoints work without 500 errors
