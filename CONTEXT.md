# Boris

Boris helps households understand Bail Reel Solidaire eligibility and connects eligible contacts with the organizations that can support or sell BRS homes.

## Language

**OFS**:
An Organisme de Foncier Solidaire that can receive and manage eligible household contacts.
_Avoid_: Portal user, seller

**Compte OFS**:
A portal user account attached to one or more OFS.
_Avoid_: OFS, commercialisateur

**Commercialisateur**:
An organization in charge of marketing or selling BRS houses or apartments on behalf of an OFS.
_Avoid_: Compte commercialisateur, OFS

**Compte commercialisateur**:
A portal user account belonging to a commercialisateur.
_Avoid_: Commercialisateur, compte OFS

**Transmission commerciale**:
An OFS-defined relationship that makes selected household contacts visible to a commercialisateur.
_Avoid_: Mandat commercial, accès OFS

**Périmètre de transmission**:
The rule that determines which contacts are included in a transmission commerciale.
_Avoid_: Accès, filtre

**Ligne de contact**:
A contact record for one searched location within an eligibility simulation.
_Avoid_: Lead, simulation

**Suivi commercialisateur**:
The follow-up metadata managed by a commercialisateur for a transmitted contact line.
_Avoid_: Suivi OFS, statut OFS

## Relationships

- An **OFS** can work with zero or more **Commercialisateurs**
- A **Commercialisateur** can work with one or more **OFS**
- A **Compte commercialisateur** belongs to exactly one **Commercialisateur**
- A **Commercialisateur** can have one or more **Comptes commercialisateur**
- All **Comptes commercialisateur** of the same **Commercialisateur** inherit the same transmitted contact access
- An **OFS** can define zero or more **Transmissions commerciales**
- A **Transmission commerciale** links exactly one **OFS** to exactly one **Commercialisateur**
- A **Transmission commerciale** adds access for a **Commercialisateur** without removing access from the **OFS**
- Several **Transmissions commerciales** can include the same contact
- A **Transmission commerciale** has exactly one **Périmètre de transmission**
- A **Périmètre de transmission** is either all contact lines visible to the **OFS**, or contact lines matching selected INSEE commune codes or department codes
- An INSEE-or-department **Périmètre de transmission** applies at the **Ligne de contact** level
- A **Ligne de contact** matches an INSEE-or-department **Périmètre de transmission** when its INSEE commune code or department code is selected
- A **Transmission commerciale** can only include **Lignes de contact** already visible to its **OFS**
- A **Compte commercialisateur** can view and export transmitted **Lignes de contact**
- A **Compte commercialisateur** dashboard groups transmitted **Lignes de contact** by **OFS**
- A **Compte commercialisateur** dashboard shows every **OFS** with an active **Transmission commerciale**, even when no contact lines currently match
- Inactive **Transmissions commerciales** are hidden from the **Compte commercialisateur** dashboard in the first version
- A **Compte commercialisateur** can see limited read-only **OFS** identity and contact details, but cannot manage the **OFS**
- A **Compte commercialisateur** manages **Suivi commercialisateur** separately from OFS follow-up metadata
- **Comptes OFS** and **Comptes commercialisateur** use the same portal application with role-specific sections
- In the first version, portal accounts have exactly one role; **Compte OFS** and **Compte commercialisateur** roles are mutually exclusive
- A **Compte commercialisateur** can log in even when its **Commercialisateur** has no active **Transmissions commerciales**
- In the first version, a **Transmission commerciale** creates dashboard and export visibility, not email notification
- An **OFS** can see which **Commercialisateurs** received a **Ligne de contact**, without managing their **Suivi commercialisateur**
- A **Compte OFS** can configure **Transmissions commerciales** for its **OFS**
- A **Compte OFS** can configure **Transmissions commerciales** for every **OFS** it can access
- A **Compte OFS** can create a **Transmission commerciale** only to a **Commercialisateur** already linked to that **OFS**
- An **OFS** can have at most one **Transmission commerciale** for a given **Commercialisateur**
- An INSEE-or-department **Transmission commerciale** can include several INSEE commune codes or department codes and is edited when its list changes
- A **Transmission commerciale** is deactivated rather than hard-deleted
- An inactive **Transmission commerciale** gives no contact-line visibility to the **Commercialisateur**
- Contact-line visibility for a **Commercialisateur** is always computed from the current active **Transmission commerciale** scope
- In the first version, admins create **Commercialisateurs** and **Comptes commercialisateur**
- Admin user management creates **Comptes commercialisateur** by assigning exactly one **Commercialisateur**
- In the first version, **Comptes OFS** configure transmission rules but do not create **Commercialisateurs**, **Comptes commercialisateur**, or OFS-Commercialisateur links
- Audit trail for **Transmission commerciale** changes is deferred from the first version

## Example dialogue

> **Dev:** "Should this **Commercialisateur** see every contact for the OFS?"
> **Domain expert:** "No, its **Comptes commercialisateur** should only see the contacts transmitted to that **Commercialisateur**."

## Flagged ambiguities

- "commercialisateur" was used to mean both the selling organization and the portal user profile; resolved: the organization is **Commercialisateur**, while the portal user is **Compte commercialisateur**.
- Existing code may use `Distributor` for **Commercialisateur**, but the portal role value should remain `commercialisateur`.
