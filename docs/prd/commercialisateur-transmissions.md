# PRD: Comptes commercialisateur et transmissions commerciales

Triage label: `needs-triage`

## Problem Statement

Les OFS reçoivent aujourd'hui dans le portail Boris des lignes de contact correspondant à leur périmètre géographique. Certains OFS travaillent avec des commercialisateurs chargés de vendre ou commercialiser des logements BRS, mais Boris ne permet pas encore de leur donner un accès encadré aux contacts transmis.

Le besoin est de créer un profil **Compte commercialisateur** dans le même portail, rattaché à un **Commercialisateur**, afin que les OFS puissent configurer des **Transmissions commerciales** vers des commercialisateurs déjà rattachés à leur OFS. Un commercialisateur doit voir uniquement les lignes de contact qui lui sont transmises, sans obtenir d'accès de gestion à l'OFS.

## Solution

Ajouter le rôle `commercialisateur` au portail existant. Les administrateurs créent les **Commercialisateurs** et leurs **Comptes commercialisateur**, puis maintiennent le rattachement OFS - Commercialisateur existant. Les **Comptes OFS** configurent ensuite leurs **Transmissions commerciales** uniquement vers les **Commercialisateurs** déjà rattachés à l'OFS concerné.

Une **Transmission commerciale** relie exactement un **OFS** et un **Commercialisateur**. Elle est additive, non exclusive, active ou inactive, et possède un **Périmètre de transmission**. Ce périmètre est soit tous les contacts visibles de l'OFS, soit une sélection de codes communes INSEE et/ou de codes départements. La visibilité est calculée au niveau de la **Ligne de contact**, toujours dans le périmètre déjà visible par l'OFS.

Le **Compte commercialisateur** accède au même portail, dans une section dédiée, avec un tableau de bord groupé par OFS. Il peut consulter et exporter les lignes transmises, voir des informations OFS limitées en lecture seule, et gérer son propre **Suivi commercialisateur**, séparé du suivi OFS.

## User Stories

1. As an administrateur, I want to create a commercialisateur, so that OFS can later transmit contact lines to it.
2. As an administrateur, I want to edit a commercialisateur, so that its identity stays accurate over time.
3. As an administrateur, I want to create a compte commercialisateur for an existing commercialisateur, so that its users can access the portal.
4. As an administrateur, I want to assign exactly one commercialisateur to a compte commercialisateur, so that the user's organization context is unambiguous.
5. As an administrateur, I want user management to support Admin, OFS, and Commercialisateur roles, so that all portal accounts are managed in one place.
6. As an administrateur, I want OFS and commercialisateur operational accounts to have exactly one role, so that portal entry points and permissions stay simple.
7. As an administrateur, I want to filter or identify comptes commercialisateur in user management, so that I can support those users.
8. As an administrateur, I want commercialisateur accounts to keep using password reset and active/inactive account controls, so that account lifecycle behavior remains consistent.
9. As a compte commercialisateur, I want to log into the existing portal, so that I do not need a separate application.
10. As a compte commercialisateur, I want to reach a commercialisateur-specific dashboard after login, so that I only see the features relevant to my profile.
11. As a compte commercialisateur with no active transmissions, I want to log in and see an empty dashboard state, so that account creation can happen before OFS configuration.
12. As a compte OFS, I want to configure transmissions commerciales for every OFS I can access, so that I can manage lead transmission for my organizations.
13. As a compte OFS, I want to select one of the commercialisateurs already linked to the OFS when creating a transmission commerciale, so that transmissions stay aligned with the OFS-commercialisateur relationship managed by admins.
14. As a compte OFS, I want to create at most one transmission commerciale per commercialisateur for an OFS, so that the relationship has a single editable configuration.
15. As a compte OFS, I want to choose whether a transmission covers all OFS-visible contact lines or a geographic subset, so that the commercialisateur receives the right contacts.
16. As a compte OFS, I want to configure a geographic subset using INSEE commune codes, so that I can route contacts by commune reliably.
17. As a compte OFS, I want to configure a geographic subset using department codes, so that I can route contacts over broader territories.
18. As a compte OFS, I want to mix INSEE commune codes and department codes in the same transmission, so that I can describe practical commercial territories.
19. As a compte OFS, I want to edit the scope of an existing transmission, so that I can add or remove communes and departments without creating duplicates.
20. As a compte OFS, I want to deactivate a transmission rather than hard-delete it, so that the historical relationship is preserved while access stops.
21. As a compte OFS, I want inactive transmissions to remove commercialisateur visibility immediately, so that access can be stopped safely.
22. As a compte OFS, I want contact-line visibility to be computed from the current active scope, so that updates apply consistently to old and new contact lines.
23. As a compte OFS, I want the OFS to keep access to all its own contact lines after transmission, so that transmission does not transfer ownership away from the OFS.
24. As a compte OFS, I want several commercialisateurs to be able to receive the same contact line, so that overlapping commercial partnerships are supported.
25. As a compte OFS, I want to see which commercialisateurs received a contact line, so that I understand where the contact was transmitted.
26. As a compte OFS, I want commercialisateur follow-up metadata to remain separate from OFS follow-up metadata, so that my workflow is not overwritten by a commercialisateur.
27. As a compte OFS, I want transmissions to stay constrained to contact lines already visible to my OFS, so that I cannot accidentally expose contacts outside my OFS scope.
28. As a compte commercialisateur, I want my dashboard grouped by OFS, so that I can work by partner OFS.
29. As a compte commercialisateur, I want every OFS with an active transmission to appear even when no lines currently match, so that I understand my active relationships.
30. As a compte commercialisateur, I do not want inactive transmissions to appear in my dashboard in V1, so that I only see current relationships.
31. As a compte commercialisateur, I want to view only the lines transmitted to my commercialisateur, so that I respect the OFS-defined perimeter.
32. As a compte commercialisateur, I want all accounts belonging to my commercialisateur to inherit the same transmitted contact access, so that organization-level access is consistent.
33. As a compte commercialisateur, I want contact-line matching to happen per searched location, so that a household searching several places only exposes matching lines.
34. As a compte commercialisateur, I want to export transmitted contact lines, so that I can work them in my sales process.
35. As a compte commercialisateur, I want to manage my own follow-up action and status for a transmitted contact line, so that I can track my commercial work.
36. As a compte commercialisateur, I want my follow-up metadata to be independent from OFS metadata, so that the OFS and commercialisateur workflows do not conflict.
37. As a compte commercialisateur, I want to see limited read-only OFS identity and contact details, so that I know which OFS partner a contact belongs to.
38. As a compte commercialisateur, I do not want to edit OFS profile, territory, users, or transmission configuration, so that I do not gain OFS management access.
39. As a compte commercialisateur, I want current active transmission scope to control historical and new visibility, so that removed territories disappear from my dashboard.
40. As a compte commercialisateur, I want my previous follow-up metadata to remain stored if a line later becomes visible again, so that work history can resume without merging it with OFS metadata.

## Implementation Decisions

- Add a `commercialisateur` portal role while keeping existing `Distributor` code naming for the **Commercialisateur** organization.
- Extend user management so operational portal accounts are single-role in V1.
- Attach each **Compte commercialisateur** to exactly one **Commercialisateur**.
- Reuse the existing portal application and authentication flow, with role-specific entry points and sections.
- Add a **Transmission commerciale** model with one active/inactive relationship per OFS and Commercialisateur pair.
- Model transmission scope as either all OFS-visible contact lines or selected INSEE commune codes and/or department codes.
- Compute commercialisateur contact visibility dynamically from current active transmission scope.
- Match conditional transmission at the **Ligne de contact** level using the location INSEE commune code or department code.
- Keep transmission constrained by the OFS-visible contact query; transmission cannot widen OFS access.
- Allow overlapping transmissions so multiple commercialisateurs can see the same line.
- Add separate **Suivi commercialisateur** metadata keyed to the commercialisateur and contact line, independent from OFS contact metadata.
- Extend portal APIs to list commercialisateur-accessible OFS, fetch transmitted contact lines, export transmitted contact lines, and update commercialisateur follow-up metadata.
- Extend OFS portal APIs and UI so OFS users can create, edit, and deactivate transmissions for accessible OFS.
- Let OFS users select only from commercialisateurs already linked to the OFS; admins remain responsible for creating commercialisateurs, comptes commercialisateur, and OFS-commercialisateur links in V1.
- Show active transmitted OFS relationships in the commercialisateur dashboard even when zero contact lines match.
- Hide inactive transmissions from the commercialisateur dashboard in V1.
- Show read-only transmitted-to commercialisateur information to OFS users on contact lines.
- Avoid email notification or email forwarding in V1; transmission means dashboard and export visibility only.
- Do not add audit trail for transmission changes in V1, while leaving the domain open for V2 audit trail.

## Testing Decisions

- Tests should assert externally visible behavior: permissions, returned contact lines, dashboard/API outputs, exports, and metadata separation.
- Repository/usecase tests should cover the deep module that computes transmitted contact visibility from OFS scope plus transmission scope.
- Authorization tests should cover role entry behavior for admin, OFS, and commercialisateur accounts.
- API/e2e tests should follow the existing portal OFS eligibility simulation tests as prior art.
- User management tests should cover creating and updating commercialisateur users, including exactly-one-commercialisateur assignment.
- Transmission configuration tests should cover one transmission per OFS/commercialisateur, rejection of unlinked commercialisateurs, active/inactive behavior, all-contact scope, INSEE scope, department scope, and mixed INSEE/department scope.
- Contact visibility tests should cover overlapping transmissions, multi-location simulations, current-scope recomputation, and the rule that transmission cannot exceed OFS scope.
- Follow-up metadata tests should prove OFS metadata and commercialisateur metadata do not overwrite each other.
- Export tests should prove commercialisateur exports include only transmitted contact lines.
- Portal UI tests should cover commercialisateur dashboard grouping by OFS, empty states, inactive-transmission hiding, and limited read-only OFS details.

## Out of Scope

- Email forwarding or notification to commercialisateurs.
- Audit trail for transmission configuration changes.
- OFS-created commercialisateurs or OFS-created comptes commercialisateur.
- Per-user restrictions inside a commercialisateur.
- Multi-role OFS plus commercialisateur accounts.
- Commercialisateur management access to OFS profile, territory, users, or transmissions.
- Exclusive assignment or ownership transfer of contact lines.
- Hard deletion of transmissions as the primary domain action.
- Separate portal application for commercialisateurs.
- Postal-code based transmission routing in V1.

## Further Notes

- The domain glossary for this feature is captured in `CONTEXT.md`.
- The normalized routing vocabulary is **INSEE commune code** and **department code**, not postal code.
- Existing location data stores both postal code and citycode, but citycode is the INSEE code and is the preferred routing key.
- The issue should be published with the `needs-triage` label when GitHub issue tracker access is available.
