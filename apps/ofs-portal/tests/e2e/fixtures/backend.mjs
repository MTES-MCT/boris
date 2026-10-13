import http from "node:http";
const ofss = [
  { id: "ofs-a", name: "OFS Alpha" },
  { id: "ofs-b", name: "OFS Beta" },
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `ofs-${i}`,
    name: `OFS Other ${i}`,
  })),
];
http
  .createServer((req, res) => {
    const path = new URL(req.url, "http://localhost").pathname;
    let data;
    if (path === "/api/portal/auth/me")
      data = {
        id: "admin",
        email: "admin@example.test",
        roles: ["admin"],
        canAccessAllOfss: true,
        ofss: [],
      };
    else if (path === "/api/portal/ofss") data = ofss;
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
    res.writeHead(data ? 200 : 404, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data || {}));
  })
  .listen(3029, "127.0.0.1");
