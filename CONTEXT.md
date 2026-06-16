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

**Simulateur embarqué OFS**:
A Boris eligibility simulator embedded on an OFS website that creates contact lines attributed to that OFS.
_Avoid_: White-label calculator, iframe lead form

**Paramètre d'intégration**:
A URL parameter that customizes the presentation or workflow of an embedded OFS simulator without changing attribution or eligibility rules.
_Avoid_: Eligibility setting, OFS setting

**Périmètre de sélection**:
The location constraint that limits which communes or departments a household can select in an embedded OFS simulator.
_Avoid_: Attribution, périmètre de transmission

**Snippet d'intégration**:
A copy-paste script that creates and resizes the embedded OFS simulator iframe on an authorized OFS website.
_Avoid_: Widget, SDK

**Domaine autorisé d'intégration**:
A website origin, not a page path, that Boris allows to embed an OFS simulator and associates with exactly one OFS for attribution.
_Avoid_: Referrer, URL whitelist

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
- A **Simulateur embarqué OFS** creates **Lignes de contact** visible to the embedding **OFS**
- A **Domaine autorisé d'intégration** authorizes the parent website to embed a **Simulateur embarqué OFS**
- A **Domaine autorisé d'intégration** determines which **OFS** receives the created **Lignes de contact**
- Boris stores **Domaines autorisés d'intégration** as admin-managed `ofs_embed_origin` records
- Admins manage **Domaines autorisés d'intégration** through a minimal admin UI in the first version
- The canonical admin management surface for **Domaines autorisés d'intégration** is the OFS admin page
- A global embed origins admin section can link to OFS-level management
- **Domaines autorisés d'intégration** are disabled and re-enabled rather than hard-deleted in the first version
- In the first version, **Comptes OFS** do not manage **Domaines autorisés d'intégration** themselves
- Boris stores embedded simulator provenance as source type and source **OFS**, without storing the request origin on the contact data
- Boris stores embedded simulator provenance when the embedded eligibility simulation is created
- Public Boris eligibility simulations use an explicit public source type by default
- **Comptes OFS** can see whether a **Ligne de contact** came from Boris public flow or their **Simulateur embarqué OFS**
- OFS portal exports include whether a **Ligne de contact** came from Boris public flow or an OFS embedded simulator
- **Comptes commercialisateur** can see whether a transmitted **Ligne de contact** came from Boris public flow or an OFS embedded simulator
- Commercialisateur exports include whether a transmitted **Ligne de contact** came from Boris public flow or an OFS embedded simulator
- A **Paramètre d'intégration** can customize a **Simulateur embarqué OFS**, but cannot override the **OFS** attribution determined by the **Domaine autorisé d'intégration**
- Boris validates the **Domaine autorisé d'intégration** when serving or framing a **Simulateur embarqué OFS** and again when creating or updating contact data
- An unauthorized **Domaine autorisé d'intégration** shows an integration error instead of the simulator
- **Lignes de contact** created by a **Simulateur embarqué OFS** are attributed at API write time from the authorized request origin
- A **Compte OFS** can see **Lignes de contact** from its **Simulateur embarqué OFS** even when their searched locations fall outside the OFS's configured geographic scope
- **Lignes de contact** from a **Simulateur embarqué OFS** can be included in **Transmissions commerciales** using the normal transmission rules
- A **Paramètre d'intégration** cannot change eligibility rules
- A **Paramètre d'intégration** can define a **Périmètre de sélection** for the location choices shown in a **Simulateur embarqué OFS**
- A **Périmètre de sélection** restricts selectable locations but does not determine the source **OFS** attribution
- In the first version, a **Périmètre de sélection** can be defined by department codes or INSEE commune codes
- A **Périmètre de sélection** is chosen by **Paramètres d'intégration** and does not need to match the OFS's admin-configured departments or regions
- Boris validates submitted locations against the **Périmètre de sélection** instead of relying only on frontend filtering
- Branding **Paramètres d'intégration** can include partner name, primary color, logo URL, and hiding Boris branding
- **Paramètres d'intégration** cannot include arbitrary custom CSS
- In the first version, a logo URL **Paramètre d'intégration** must be HTTPS and same-origin with the authorized OFS embedding origin
- Copy **Paramètres d'intégration** are limited to controlled variants in the first version
- **Paramètres d'intégration** cannot override consent wording or eligibility explanations
- A **Simulateur embarqué OFS** keeps the current Boris completion page inside the iframe in the first version
- **Paramètres d'intégration** do not include completion redirects in the first version
- First-version **Paramètres d'intégration** are `parentOrigin`, `selectionDepartments`, `selectionCitycodes`, `partnerName`, `primaryColor`, `logoUrl`, `hideBorisBranding`, and `intro`
- First-version **Paramètres d'intégration** do not include `ofsId`, `source`, `customCssUrl`, `completionUrl`, consent text, eligibility thresholds, or custom API destinations
- OFS-facing documentation for the **Simulateur embarqué OFS** is written in French
- A **Simulateur embarqué OFS** is intended to create **Lignes de contact**, not anonymous calculator-only sessions
- A **Simulateur embarqué OFS** reuses the current Boris eligibility simulator flow: show eligibility results, explain them, then ask for contact details
- A **Simulateur embarqué OFS** has a dedicated embed surface while sharing the normal Boris simulator internals
- A **Simulateur embarqué OFS** embed surface is not indexed by search engines
- Embedded simulator contact writes use embed-specific API endpoints that reuse the normal eligibility simulation behavior
- Embedded simulator contact writes use origin authorization rather than an API key
- Origin authorization for a **Simulateur embarqué OFS** is intended to prevent unauthorized website embedding, not to authenticate non-browser scripts
- Rate limiting, payload validation, and spam monitoring mitigate abuse of embedded simulator contact writes in the first version
- A **Snippet d'intégration** is the preferred way for an OFS to embed a **Simulateur embarqué OFS**
- The first-version **Snippet d'intégration** uses a stable versionless URL
- A raw iframe is the fallback integration method for a **Simulateur embarqué OFS**
- The **Snippet d'intégration** sends the parent website origin to Boris automatically
- Raw iframe fallback integrations must provide the parent website origin explicitly

## Example dialogue

> **Dev:** "Should this **Commercialisateur** see every contact for the OFS?"
> **Domain expert:** "No, its **Comptes commercialisateur** should only see the contacts transmitted to that **Commercialisateur**."

> **Dev:** "Should the embedded simulator only calculate eligibility?"
> **Domain expert:** "No, a **Simulateur embarqué OFS** should create **Lignes de contact** attributed to the embedding **OFS**."

> **Dev:** "Can the iframe URL decide which **OFS** receives the contact?"
> **Domain expert:** "No, the embedding **Domaine autorisé d'intégration** determines the **OFS** attribution."

> **Dev:** "If the embedded simulator restricts location choices, does that restriction decide the receiving **OFS**?"
> **Domain expert:** "No, the **Périmètre de sélection** shapes what the household can choose, but the source **OFS** still comes from the **Domaine autorisé d'intégration**."

> **Dev:** "Can an OFS embed the simulator without the contact step?"
> **Domain expert:** "No, the point of a **Simulateur embarqué OFS** is to create **Lignes de contact**."

> **Dev:** "Should the OFS embed ask for contact details before the result?"
> **Domain expert:** "No, it should keep the current Boris flow: result first, explanation second, contact details after that."

> **Dev:** "Should OFS teams copy an iframe directly?"
> **Domain expert:** "They can, but the preferred integration is a **Snippet d'intégration** that creates and resizes the iframe."

## Flagged ambiguities

- "commercialisateur" was used to mean both the selling organization and the portal user profile; resolved: the organization is **Commercialisateur**, while the portal user is **Compte commercialisateur**.
- Existing code may use `Distributor` for **Commercialisateur**, but the portal role value should remain `commercialisateur`.
- "lead" was used for embedded simulator output; resolved: the domain term is **Ligne de contact**.
- "URL whitelist" was used for embed authorization; resolved: the domain term is **Domaine autorisé d'intégration**.
- "params" was used broadly; resolved: **Paramètres d'intégration** are presentation or workflow customizations only, not attribution or eligibility settings.
