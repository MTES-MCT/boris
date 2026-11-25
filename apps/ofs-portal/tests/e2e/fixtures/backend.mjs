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
let memberInvitations = [];
http
  .createServer(async (req, res) => {
    const path = new URL(req.url, "http://localhost").pathname;
    const url = new URL(req.url, "http://localhost");
    let body = {};
    if (req.method === "POST" || req.method === "PUT") {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      body = raw ? JSON.parse(raw) : {};
    }
    let data;
    let status = 200;
    const setup = "/api/portal/auth/two-factor/enrollment";
    const enabled = req.headers.cookie?.includes("setup-enabled=1");
    const setupPending = req.headers.cookie?.includes("setup-pending=1");
    const enrollmentLogin = req.headers.cookie?.includes(
      "boris.sid=enrollment",
    );
    if (path === "/api/portal/auth/two-factor/disable") {
      if (!req.headers.cookie?.includes("setup-non-admin=1")) {
        res.writeHead(403);
        res.end();
        return;
      }
      if (
        body.currentPassword !== "correct-password" ||
        body.code !== "654321"
      ) {
        res.writeHead(400);
        res.end();
        return;
      }
      res.setHeader("set-cookie", [
        "setup-enabled=; Path=/; Max-Age=0",
        "boris.sid=; Path=/; Max-Age=0",
        "setup-signed-out=1; Path=/; HttpOnly",
      ]);
      res.writeHead(204);
      res.end();
      return;
    }
    if (
      path === "/api/portal/auth/me" &&
      req.headers.cookie?.includes("setup-signed-out=1")
    ) {
      res.writeHead(401);
      res.end();
      return;
    }
    if (path.startsWith(setup)) {
      if (
        req.headers.cookie?.includes("two-factor-test=1") &&
        !enrollmentLogin &&
        !req.headers.cookie?.includes("boris.sid=verified")
      ) {
        res.writeHead(401);
        res.end();
        return;
      }
      const secret = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";
      if (path === setup && req.method === "POST") {
        if (body.currentPassword !== "correct-password") {
          res.writeHead(401);
          res.end();
          return;
        }
        res.setHeader(
          "set-cookie",
          "setup-pending=1; Path=/; HttpOnly; SameSite=Strict",
        );
        data = {
          enabled: false,
          secret,
          uri: `otpauth://totp/BoRiS:test?secret=${secret}&issuer=BoRiS`,
          email: "test@example.test",
        };
      } else if (path.endsWith("/confirm")) {
        if (!setupPending || body.code !== "123456") {
          res.writeHead(400);
          res.end(JSON.stringify({ message: "TWO_FACTOR_INVALID" }));
          return;
        }
        res.setHeader("set-cookie", [
          "setup-enabled=1; Path=/; HttpOnly; SameSite=Strict",
          "boris.sid=verified; Path=/; HttpOnly; SameSite=Strict",
        ]);
        data = {
          recoveryCodes: Array.from(
            { length: 10 },
            (_, i) =>
              `${String(i).padStart(8, "0")}-abcdefab-12345678-abcdefab`,
          ),
        };
      } else if (path.endsWith("/cancel")) {
        res.setHeader("set-cookie", "setup-pending=; Path=/; Max-Age=0");
        res.writeHead(204);
        res.end();
        return;
      } else
        data = {
          enabled: !!enabled,
          canDisable:
            !!enabled && req.headers.cookie?.includes("setup-non-admin=1"),
          secret: setupPending && !enabled ? secret : null,
          uri:
            setupPending && !enabled
              ? `otpauth://totp/BoRiS:test?secret=${secret}&issuer=BoRiS`
              : null,
          email: "test@example.test",
        };
      res.writeHead(200, {
        "content-type": "application/json",
        "cache-control": "no-store",
      });
      res.end(JSON.stringify(data));
      return;
    }
    // Cookie-scoped auth fixtures keep existing always-authenticated UI tests intact.
    if (req.headers.cookie?.includes("two-factor-test=1")) {
      const pending = req.headers.cookie.includes("boris.sid=pending");
      const verified = req.headers.cookie.includes("boris.sid=verified");
      if (path === "/api/portal/auth/login") {
        if (body.email === "unprovisioned@example.test") {
          res.setHeader(
            "set-cookie",
            "boris.sid=enrollment; Path=/; HttpOnly; SameSite=Strict",
          );
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify({ enrollmentRequired: true }));
          return;
        }
        res.setHeader(
          "set-cookie",
          "boris.sid=pending; Path=/; HttpOnly; SameSite=Strict",
        );
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ twoFactorRequired: true }));
        return;
      }
      if (path === "/api/portal/auth/two-factor") {
        if (!pending) res.writeHead(401);
        else if (req.method === "GET") {
          res.writeHead(200, { "content-type": "application/json" });
          res.end(JSON.stringify({ twoFactorRequired: true }));
          return;
        } else if (
          ["123456", "12345678-abcdefab-12345678-abcdefab"].includes(body.code)
        ) {
          res.setHeader(
            "set-cookie",
            "boris.sid=verified; Path=/; HttpOnly; SameSite=Strict",
          );
          res.writeHead(204);
        } else res.writeHead(400);
        res.end();
        return;
      }
      if (path === "/api/portal/auth/me" && !verified) {
        res.writeHead(401);
        res.end();
        return;
      }
    }
    if (path === "/test/reset") {
      linked = [];
      invitations = [];
      memberInvitations = [];
      data = {};
    } else if (path === "/api/portal/account-name") {
      data = { firstName: "Alice", lastName: "Martin" };
    } else if (/\/members$/.test(path)) {
      data = {
        members: [
          {
            id: "alice",
            firstName: "Alice",
            lastName: "Martin",
            email: "alice@example.test",
          },
          {
            id: "bob",
            firstName: null,
            lastName: null,
            email: "bob@example.test",
          },
        ],
        invitations: memberInvitations,
      };
    } else if (path.endsWith("/members/invitations") && req.method === "POST") {
      memberInvitations.push({
        id: "member-invite",
        email: body.email,
        status: "pending",
        expiresAt: "2030-01-01",
      });
      data = { message: "Invitation envoyée, valable 7 jours." };
    } else if (/\/members\/invitations\/[^/]+\/(resend|cancel)$/.test(path)) {
      if (path.endsWith("cancel")) memberInvitations[0].status = "cancelled";
      data = {
        message: path.endsWith("cancel")
          ? "Invitation annulée."
          : "Invitation renvoyée, valable 7 jours. Le précédent lien est invalidé.",
      };
    } else if (path === "/api/portal/ofs-invitations/inspect") {
      if (body.token === "expired") {
        status = 400;
        data = { message: "Cette invitation est expirée." };
      } else
        data = {
          email: "colleague@example.test",
          ofsName: "OFS Alpha",
          existingAccount: body.token === "existing",
        };
    } else if (path === "/api/portal/ofs-invitations/accept") {
      data = {
        message: body.password
          ? "Votre compte OFS a été créé."
          : "Vous avez rejoint l’équipe de cet OFS.",
      };
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
    } else if (/\/eligibility-simulations\/[^/]+\/metadata$/.test(path))
      data = { simulationId: path.split("/").at(-2), ...body };
    else if (path === "/api/portal/ofss/ofs-a/eligibility-simulations")
      data = {
        items: [
          ...["Rennes", "Saint-Malo", "Vitré", "Fougères", "Redon"].map(
            (city, index) => ({
              simulationId: "simulation-a",
              locationId: `location-${index}`,
              submittedAt: "2026-10-19T10:00:00Z",
              fullName: "Alice Martin",
              email: "alice@example.test",
              phone: "0102030405",
              city,
              inseeCode: ["35238", "35288", "35360", "35115", "35236"][index],
              departementCode: "35",
              householdSize: 2,
              hasDisability: false,
              taxableIncome: 42000,
              resources: 3000,
              contribution: 20000,
              propertySituation: "Locataire",
              housingType: "T3",
              action: null,
              status: null,
              isNew: true,
              transmittedDistributors: [
                {
                  id: `distributor-${index % 2}`,
                  name: index % 2 ? "Habitat Côte" : "Habitat Rennes",
                },
              ],
            }),
          ),
          {
            simulationId: "simulation-b",
            locationId: "location-b",
            submittedAt: "2026-10-18T10:00:00Z",
            fullName: "Alice Martin",
            email: "alice@example.test",
            phone: "0102030405",
            city: null,
            inseeCode: null,
            departementCode: "35",
            householdSize: 1,
            hasDisability: null,
            action: null,
            status: null,
            isNew: false,
            transmittedDistributors: [],
          },
        ],
        totalCount: 2,
        page: 1,
        pageSize: 20,
        pagesCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    else if (path.endsWith("/eligibility-simulations"))
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
