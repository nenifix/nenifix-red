# Security Specification: NeniFix Firestore Security Core

We define here the formal security baseline, data invariants, adversarial threat models (The "Dirty Dozen" payloads), and tests representing the security boundaries for NeniFix.

## 1. Data Invariants

1. **ID Character Integrity**: The meeting document ID (`{meetingId}`) and the `id` field must strictly match the ID structure `^[a-zA-Z0-9_\-]+$` and be under 128 characters in size limit.
2. **Mandatory Size Constraints**: Every string field MUST be bounded to prevent Denial of Wallet resource fatigue:
   - `name`: 1 to 100 characters.
   - `email`: 3 to 100 characters.
   - `id`: 5 to 64 characters.
   - `status`: Must be one of a small set (`Confirmed`, `Pending`, `Completed`).
3. **Immutability of Origin**: Meeting records cannot have their core identity mutated post-creation. Once set, critical fields like `id`, `email`, and `createdAt` are locked.
4. **No Arbitrary Deletion**: General guest public users cannot delete scheduled briefings. Only system admins can purge.

---

## 2. The "Dirty Dozen" Threat Payloads

We design twelve adversarial payloads targeted at the `/meetings/{meetingId}` path. All of these must fail authorization (PERMISSION_DENIED).

1. **Payload 1: Identity Spoofing (ID Poisoning)**
   - Target: `/meetings/Junk$$$$$$ID!`
   - Threat: Violating character regex invariants for path keys.

2. **Payload 2: Shadow Field Injection (Shadow Update)**
   - Target: `/meetings/NF-CONF-982121`
   - Content: `{ ..., "adminOverridePrivilege": true, "superAdmin": true }`
   - Threat: Shadow key privilege escalation.

3. **Payload 3: Denial-of-Wallet (Overflow Name)**
   - Content: `{ "name": "A" * 1000000, ... }`
   - Threat: Resource exhaustion by writing mega-strings.

4. **Payload 4: Denial-of-Wallet (Overflow Email)**
   - Content: `{ "email": "B" * 500000, ... }`
   - Threat: Resource exhaustion via un-validated field sizes.

5. **Payload 5: Malicious Status Escalation (State Bypassing)**
   - Content: `{ "status": "APPROVED_SUPER_ADMIN_VIP", ... }`
   - Threat: Setting un-validated state labels.

6. **Payload 6: Client Timestamp Manipulation**
   - Content: `{ "createdAt": "2031-01-01" }`
   - Threat: Forging timeline parameters (failing current database check).

7. **Payload 7: Post-Approval Update Hijack**
   - Action: Existing document status is `"Completed"`, attacker tries to change it to `"Confirmed"`.
   - Threat: Overriding finished terminal states.

8. **Payload 8: Unauthorized Document Deletion**
   - Action: General unauthenticated guest deletes an existing meeting.
   - Threat: Denial of service to active clients.

9. **Payload 9: Email Spoofing Attack**
   - Content: `{ "email": "" }` (Empty or missing email)
   - Threat: Creating blank profile targets.

10. **Payload 10: Array Poisoning Bypass**
    - Content: Adding custom list structures where scalar string is required.
    - Threat: Schema type confusion.

11. **Payload 11: Bulk Scraping Attempt (Client Query Trust)**
    - Action: Querying listings without query filter bounds or query constraints.
    - Threat: Bulk list harvesting.

12. **Payload 12: Orphaned ID Linkage (Immutability Violation)**
    - Action: Updating an existing meeting ID (`NF-CONF-123` -> `NF-CONF-999`).
    - Threat: Modifying immutable business identifiers.

---

## 3. Test Runner Definition

This spec maps validation rules in the main `firestore.rules` file to prevent these.
The validation suite can be loaded to execute verification actions.
