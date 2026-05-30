# Security Specification - Agri-Ecosystem (कृषि प्रबंधन)

This document provides (1) Data Invariants, (2) The "Dirty Dozen" attacking payloads designed to bypass integrity and validation, and (3) The Test Suite mapping the rules.

## 1. Data Invariants

1. **User Role Lock**: No operator user can upgrade their own `role` field from `"operator"` to `"super_admin"`. Super admin role assignment is immutable once written or strictly controlled.
2. **Strict Identity Ownership**: Any creation logic of Farmers, Transactions, or Labor logs MUST bind `createdByOperatorId` and `lastUpdatedByOperatorId` strictly to `request.auth.uid`. No spoofing of authorship is allowed.
3. **Temporal Validity**: Any document insertion or alteration must set `createdAt` (on create) and `updatedAt` (on update) strictly equal to the server-authoritative timestamp `request.time`.
4. **ID Sanitization**: Document IDs for Farmers, Transactions, and Labor must be alphanumeric string identifiers capped at 128 characters, matching the regular expression `^[a-zA-Z0-9_\-]+$`.
5. **Deduction and Profit Accuracy (Financial Integrity)**: Deductions cannot be negative, Net weight cannot exceed Gross Weight, and Payment status must map to standard enum types (`paid`, `partially_paid`, `unpaid`).
6. **Mandi Calculations Schema Protection**: If `isMandiSale` is true, mandi transaction amounts must be computed strictly via transparent math:
   `deductions = (grossWeight * deductionRate) / 100` (assuming deduction rate is kg per quintal, 100 kg = 1 quintal)
   `netWeight = grossWeight - deductions`
   `finalAmount = netWeight * ratePerQuintal`
7. **Labor Financial Limits**: Contract wages and advances cannot be negative, and `dueBalance` must equal `contractAmount - advancePaid`.

---

## 2. The "Dirty Dozen" Malicious Payloads

The following payloads target the Firestore API to inject corrupt or privileged data. Our security rules will return `PERMISSION_DENIED` on all of them.

### Attack 1: Self-Privilege Escalation
An operator tries to register or update their own profile inside `/users/{userId}` to turn themselves into a `super_admin`.
```json
{
  "id": "operator_uid",
  "name": "Malicious Operator",
  "email": "operator@test.com",
  "role": "super_admin",
  "createdAt": "2026-05-28T14:38:25Z",
  "updatedAt": "2026-05-28T14:38:25Z"
}
```

### Attack 2: Author Spoofing on Farmer Creation
Operator `bad_guy` tries to register a farmer but sets `createdByOperatorId` to `innocent_operator` to frame or blame someone else for fake data entries.
```json
{
  "id": "farmer_123",
  "name": "Ramesh Kumar",
  "village": "Pipariya",
  "phone": "9876543210",
  "totalAcreage": 10,
  "activeCrop": "Wheat",
  "createdAt": "2026-05-28T14:38:25Z",
  "updatedAt": "2026-05-28T14:38:25Z",
  "createdByOperatorId": "innocent_operator",
  "lastUpdatedByOperatorId": "innocent_operator"
}
```

### Attack 3: Spoofed Client-Side Timestamps
An attacker tries to insert a historic date into `createdAt` to make a newly registered farmer profile appear to have been created 3 years ago.
```json
{
  "id": "farmer_777",
  "name": "Kartar Singh",
  "village": "Madhya",
  "phone": "9999999999",
  "totalAcreage": 5,
  "activeCrop": "Soybean",
  "createdAt": "1999-01-01T00:00:00Z",
  "updatedAt": "2026-05-28T14:38:25Z",
  "createdByOperatorId": "operator_uid",
  "lastUpdatedByOperatorId": "operator_uid"
}
```

### Attack 4: Missing Schema Shadow Field Injection
An attacker inserts a "ghost field" `isApprovedByAdmin: true` into a Transaction to bypass a verification gate.
```json
{
  "id": "tx_999",
  "farmerId": "farmer_abc",
  "crop": "Paddy",
  "type": "income",
  "category": "sale",
  "amount": 50000,
  "date": "2026-05-28",
  "financialYear": "2026-2027",
  "isMandiSale": false,
  "isCreditSale": false,
  "paymentStatus": "paid",
  "isApprovedByAdmin": true,
  "createdAt": "2026-05-28T14:38:25Z",
  "updatedAt": "2026-05-28T14:38:25Z",
  "createdByOperatorId": "operator_uid",
  "lastUpdatedByOperatorId": "operator_uid"
}
```

### Attack 5: Negative Financial Payload Poisoning
Attacker submits a negative expense amount to inflate earnings or hack calculations.
```json
{
  "id": "tx_neg",
  "farmerId": "farmer_abc",
  "crop": "P Paddy",
  "type": "expense",
  "category": "seeds",
  "amount": -50000,
  "date": "2026-05-28",
  "financialYear": "2026-2027",
  "isMandiSale": false,
  "isCreditSale": false,
  "paymentStatus": "paid",
  "createdAt": "2026-05-28T14:38:25Z",
  "updatedAt": "2026-05-28T14:38:25Z",
  "createdByOperatorId": "operator_uid",
  "lastUpdatedByOperatorId": "operator_uid"
}
```

### Attack 6: Fraudulent Net Weight Over Gross Weight
An attacker registers a harvest sale where `deductions` are `-5.0` quintals, which mathematically makes "Net Weight" larger than "Gross Weight", artificially creating phantom harvests.
```json
{
  "id": "tx_fraud_mandi",
  "farmerId": "farmer_abc",
  "crop": "Paddy",
  "type": "income",
  "category": "crop_sale",
  "amount": 42000,
  "date": "2026-05-28",
  "financialYear": "2026-2027",
  "isMandiSale": true,
  "grossWeight": 10,
  "deductionRate": -2,
  "deductions": -0.2,
  "netWeight": 10.2,
  "ratePerQuintal": 3200,
  "traderName": "Ramlal & Co",
  "isCreditSale": false,
  "paymentStatus": "paid",
  "createdAt": "2026-05-28T14:38:25Z",
  "updatedAt": "2026-05-28T14:38:25Z",
  "createdByOperatorId": "operator_uid",
  "lastUpdatedByOperatorId": "operator_uid"
}
```

### Attack 7: ID Path Poisoning Attack
Attacker hits `/farmers/%2E%2E%2Fadmins%2Foperator_uid` to overwrite files by injecting relative paths or excessive 10K junk payload IDs.
```json
{
  "id": "long_junk_string_over_128_chars_and_special_symbols_!!!",
  "name": "Spammer Name",
  "village": "Junk",
  "phone": "0000000000",
  "totalAcreage": 1,
  "activeCrop": "Junk",
  "createdAt": "2026-05-28T14:38:25Z",
  "updatedAt": "2026-05-28T14:38:25Z",
  "createdByOperatorId": "operator_uid",
  "lastUpdatedByOperatorId": "operator_uid"
}
```

### Attack 8: Unauthorized Client Read-Scraping
An unauthenticated or untrusted regular user tries to query all financial transactions to download proprietary agribusiness margins or PII.
```json
Query: db.collection("transactions").get()
```

### Attack 9: Invalid Enum Values In Labor Mode
Attacker submits a labor entry with `mode: "robots_and_drones"` instead of standard enum `"individual"` or `"bulk_gang"`.
```json
{
  "id": "lab_err",
  "farmerId": "farmer_abc",
  "date": "2026-05-28",
  "crop": "Cotton",
  "mode": "robots_and_drones",
  "contractAmount": 1000,
  "advancePaid": 200,
  "dueBalance": 800,
  "createdAt": "2026-05-28T14:38:25Z",
  "updatedAt": "2026-05-28T14:38:25Z",
  "createdByOperatorId": "operator_uid",
  "lastUpdatedByOperatorId": "operator_uid"
}
```

### Attack 10: Labor Due-Balance Deception
An operator entries wage calculation with bad arithmetic, claiming to pay advances but stating due debt is zero. E.g.: `contractAmount: 5000`, `advancePaid: 1000` but `dueBalance: 0` to steal money.
```json
{
  "id": "lab_theft",
  "farmerId": "farmer_abc",
  "date": "2026-05-28",
  "crop": "Cotton",
  "mode": "individual",
  "laborerName": "Anoop",
  "attendance": "present",
  "contractAmount": 5000,
  "advancePaid": 1000,
  "dueBalance": 0,
  "createdAt": "2026-05-28T14:38:25Z",
  "updatedAt": "2026-05-28T14:38:25Z",
  "createdByOperatorId": "operator_uid",
  "lastUpdatedByOperatorId": "operator_uid"
}
```

### Attack 11: Orphaning Transactions
Inserting transactions tied to non-existent Farmer IDs to bloat database space and pollute indices.
```json
{
  "id": "tx_orph",
  "farmerId": "ghost_farmer_id_9999",
  "crop": "Paddy",
  "type": "income",
  "category": "sale",
  "amount": 25000,
  "date": "2026-05-28",
  "financialYear": "2026-2027",
  "isMandiSale": false,
  "isCreditSale": false,
  "paymentStatus": "paid",
  "createdAt": "2026-05-28T14:38:25Z",
  "updatedAt": "2026-05-28T14:38:25Z",
  "createdByOperatorId": "operator_uid",
  "lastUpdatedByOperatorId": "operator_uid"
}
```

### Attack 12: Changing Immutable Creator Audit Fields on Update
An operator tries to update a Transaction to change its original `createdByOperatorId` to another user's ID, escaping the audit trail.
```json
Update payload of existing record:
{
  "createdByOperatorId": "malicious_operator_uid"
}
```

---

## 3. Test Runner Design (`firestore.rules.test.ts`)

A simulated test environment verifying security blocks:

```typescript
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "agri-ecosystem-test",
    firestore: {
      rules: require("fs").readFileSync("firestore.rules", "utf8"),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe("Agri-Ecosystem Zero-Trust Security Auditing", () => {
  test("Attack 1: Deny Role Escalation to Operator", async () => {
    const operatorDb = testEnv.authenticatedContext("operator_uid").firestore();
    await assertFails(
      operatorDb.doc("users/operator_uid").set({
        id: "operator_uid",
        name: "Malicious Operator",
        email: "operator@test.com",
        role: "super_admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  });

  test("Attack 2: Deny Spoofed Creator ID in Farmers", async () => {
    const maliciousDb = testEnv.authenticatedContext("bad_guy").firestore();
    await assertFails(
      maliciousDb.doc("farmers/farmer_123").set({
        id: "farmer_123",
        name: "Ramesh",
        village: "Pipariya",
        phone: "9876543210",
        totalAcreage: 10,
        activeCrop: "Wheat",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdByOperatorId: "innocent_operator",
        lastUpdatedByOperatorId: "bad_guy",
      })
    );
  });
});
```
