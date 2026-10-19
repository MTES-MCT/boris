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
- Admins can create **Commercialisateurs** and **Comptes commercialisateur** directly
- Admin user management creates **Comptes commercialisateur** by assigning exactly one **Commercialisateur**
- A **Compte OFS** can immediately link an existing **Commercialisateur** to an OFS it can access, without requesting an email or creating an account
- A **Compte OFS** can invite a new **Commercialisateur** by providing its name and the email of its first **Compte commercialisateur**
- Names are matched approximately against existing **Commercialisateurs** to suggest reuse; matching never automatically merges organizations
- An invitation stores the proposed name, invited email and inviting OFS; it creates neither a **Commercialisateur** nor a **Compte commercialisateur** until accepted
- Invitations expire after seven days; the inviting OFS can list, resend or cancel them. Resending renews the expiry and invalidates the previous link
- Invitation acceptance creates a **Commercialisateur**, a single-role **Compte commercialisateur**, and the OFS-Commercialisateur link atomically
- If an invited email already belongs to an active **Compte commercialisateur**, its existing **Commercialisateur** is immediately linked to the OFS, with an explanation and no new invitation or account
- Emails belonging to **Comptes OFS** or admins cannot receive commercialisateur invitations; the OFS must use a different email
- Acceptance rechecks email ownership and similar organization names because other accounts or **Commercialisateurs** may have been created while the invitation was pending
- If the invitee selects an existing **Commercialisateur** during acceptance, only the OFS link is created; the invitee must ask platform administration for organization membership
- Creating a distinct organization despite suggested matches requires explicit confirmation
- Linking or accepting an invitation does not create a **Transmission commerciale** or grant contact visibility
- Admins can use the same linking and invitation flow for any OFS
- Audit trail for **Transmission commerciale** changes is deferred from the first version

## Example dialogue

> **Dev:** "Should this **Commercialisateur** see every contact for the OFS?"
> **Domain expert:** "No, its **Comptes commercialisateur** should only see the contacts transmitted to that **Commercialisateur**."

## Flagged ambiguities

- "commercialisateur" was used to mean both the selling organization and the portal user profile; resolved: the organization is **Commercialisateur**, while the portal user is **Compte commercialisateur**.
- Existing code may use `Distributor` for **Commercialisateur**, but the portal role value should remain `commercialisateur`.

## Programmes BRS

- A **Programme BRS** is a map point (`BrsDiffusionWebsite`) attached to exactly one OFS when managed from the portal.
- A **Compte OFS** can list, create, edit and delete all programmes attached to the OFS currently selected in the portal, including programmes created by admins.
- A **Compte OFS** attached to several OFS must switch the selected OFS to manage another OFS's programmes.
- An admin can list, create, edit and delete programmes for any selected OFS in the portal without an OFS attachment. The **Programmes** menu entry is visible to both admins and **Comptes OFS** after selecting an OFS.
- The backend checks the admin role or the OFS role with account attachment, and programme ownership for every portal operation; the programme's OFS cannot be changed from its form.
- **Comptes commercialisateur** cannot manage programmes in this version. Admin map management remains available in the administration.
- Creating or editing a programme publishes its changes without an approval step. The public map uses a runtime cache of 30 seconds; updates and deletions appear on the next map load after that cache expires. Drafts and OFS approval are deferred.
- The programme dashboard can be filtered by postal code, city and commercialisateur name. Filters combine, accept partial text and ignore case and accents.
- Portal programme forms require a name, HTTP(S) announcement URL, street address, city and housing type (new by default). Delivery month, INSEE commune code and commercialisateur are optional.
- An OFS can select only a commercialisateur linked to that OFS.
- Programme deletion sets `isDeleted` to true; deleted programmes are excluded from the portal, administration listings, public map and proximity searches. This version provides no restoration interface.
