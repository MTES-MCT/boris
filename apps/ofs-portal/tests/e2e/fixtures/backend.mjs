import http from "node:http";
const ofss = [
  { id: "ofs-a", name: "OFS Alpha" },
  { id: "ofs-b", name: "OFS Beta" },
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `ofs-${i}`,
    name: `OFS Other ${i}`,
  })),
];
let linked = [];
let invitations = [];
http
  .createServer(async (req, res) => {
    const path = new URL(req.url, "http://localhost").pathname;
    const url = new URL(req.url, "http://localhost");
    let body = {};
    if (req.method === "POST") {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      body = raw ? JSON.parse(raw) : {};
    }
    let data;
    let status = 200;
    if (path === "/test/reset") {
      linked = [];
      invitations = [];
      data = {};
    } else if (path.endsWith("/distributors/search")) {
      data = /habitat/i.test(url.searchParams.get("name") || "")
        ? [{ id: "existing", name: "Habitat Solidaire" }]
        : [];
    } else if (path.endsWith("/distributors")) {
      data = linked.map((item) => ({
        ...item,
        emails:
          item.id === "existing"
            ? ["alice@habitat.test", "bob@habitat.test"]
            : [],
      }));
    } else if (path.endsWith("/distributors/link")) {
      linked = [{ id: "existing", name: "Habitat Solidaire" }];
      data = {
        message:
          "Habitat Solidaire est rattaché à votre OFS. Aucun compte ni invitation n'a été créé.",
      };
    } else if (
      path.endsWith("/distributors/invitations") &&
      req.method === "POST"
    ) {
      if (body.email === "ofs@example.test") {
        status = 409;
        data = {
          message:
            "Cette adresse est déjà associée à un compte OFS ou administrateur. Utilisez une autre adresse e-mail.",
        };
      } else {
        invitations.push({
          id: "invite-a",
          name: body.name,
          email: body.email,
          status: "pending",
          expiresAt: "2026-10-21T12:00:00Z",
        });
        data = { message: "Invitation envoyée, valable 7 jours." };
      }
    } else if (path.endsWith("/distributors/invitations")) data = invitations;
    else if (
      /\/distributors\/invitations\/[^/]+\/(resend|cancel)$/.test(path)
    ) {
      if (path.endsWith("cancel")) invitations[0].status = "cancelled";
      data = {
        message: path.endsWith("cancel")
          ? "Invitation annulée."
          : "Invitation renvoyée, valable 7 jours.",
      };
    } else if (path === "/api/portal/distributor-invitations/inspect") {
      if (body.token === "expired") {
        status = 400;
        data = { message: "Cette invitation est expirée." };
      } else
        data = {
          name: "Habitat Solidaire",
          email: "person@example.test",
          ofsName: "OFS Alpha",
          existingDistributor: null,
          matches:
            body.token === "matches"
              ? [{ id: "existing", name: "Habitat Solidaire" }]
              : [],
        };
    } else if (path === "/api/portal/distributor-invitations/accept") {
      data = {
        accountCreated: !body.distributorId,
        message: body.distributorId
          ? "Habitat Solidaire est rattaché à l’OFS. Aucun compte n’a été créé."
          : "Votre compte commercialisateur a été créé.",
      };
    } else if (path === "/api/portal/auth/me")
      data = {
        id: "admin",
        email: "admin@example.test",
        roles: ["admin"],
        canAccessAllOfss: true,
        ofss: [],
      };
    else if (path === "/api/portal/ofss") data = ofss;
    else if (path.endsWith("/programs")) {
      const ofs = ofss.find(
        (item) => path === `/api/portal/ofss/${item.id}/programs`,
      );
      if (ofs)
        data = {
          ofs: { ...ofs, distributors: [] },
          programs: [
            {
              id: "program-1",
              programName: "Les Jardins",
              source: "https://example.test/jardins",
              address: "1 rue des Jardins",
              city: "Rennes",
              zipcode: "35000",
              housingType: "new",
              distributor: { id: "coop", name: "Coopérative Habitat" },
            },
            {
              id: "program-2",
              programName: "Les Terrasses",
              source: "https://example.test/terrasses",
              address: "2 rue des Terrasses",
              city: "Rennes",
              zipcode: "35200",
              housingType: "new",
              distributor: null,
            },
            {
              id: "program-3",
              programName: "Les Rives",
              source: "https://example.test/rives",
              address: "3 rue des Rives",
              city: "Nantes",
              zipcode: "44000",
              housingType: "old",
              distributor: { id: "coop", name: "Coopérative Habitat" },
            },
          ],
        };
    } else if (path.endsWith("/eligibility-simulations"))
      data = {
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 20,
        pagesCount: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    else data = ofss.find((ofs) => path === `/api/portal/ofss/${ofs.id}`);
    if (data && /^\/api\/portal\/ofss\/[^/]+$/.test(path))
      data = { ...data, distributors: linked };
    res.writeHead(data ? status : 404, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data || {}));
  })
  .listen(3029, "127.0.0.1");
