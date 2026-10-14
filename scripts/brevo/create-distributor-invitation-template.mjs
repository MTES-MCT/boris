import fs from "node:fs";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const envPath = fileURLToPath(
  new URL("../../apps/backend/.env", import.meta.url),
);
const envContent = fs.readFileSync(envPath, "utf8");
const config = dotenv.parse(envContent);
const apiKey = config.BREVO_API_KEY || process.env.BREVO_API_KEY;
if (!apiKey) throw new Error("BREVO_API_KEY is not configured");

async function api(path, method = "GET", body) {
  const response = await fetch(`https://api.brevo.com/v3${path}`, {
    method,
    headers: { "api-key": apiKey, "content-type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const reason = String(error.message || error.code || "").replaceAll(
      apiKey,
      "[redacted]",
    );
    throw new Error(
      `Brevo ${method} ${path} returned HTTP ${response.status}: ${reason}`,
    );
  }
  return response.json();
}

const templateName = "BoRiS - Invitation commercialisateur";
let existing;
for (let offset = 0; ; offset += 100) {
  const page = await api(
    `/smtp/templates?limit=100&offset=${offset}&sort=desc`,
  );
  existing = page.templates.find((template) => template.name === templateName);
  if (existing || page.templates.length < 100) break;
}
const id =
  existing?.id ||
  (
    await api("/smtp/templates", "POST", {
      templateName,
      subject: "{{ params.ofsName }} vous invite sur BoRiS",
      sender: { name: "BoRiS", email: "contact@boris.beta.gouv.fr" },
      replyTo: "contact@boris.beta.gouv.fr",
      tag: "distributor-invitation",
      isActive: true,
      htmlContent: fs.readFileSync(
        new URL("./distributor-invitation.html", import.meta.url),
        "utf8",
      ),
    })
  ).id;
console.log(JSON.stringify({ id, action: existing ? "reused" : "created" }));

const template = await api(`/smtp/templates/${id}`);
if (!template.isActive) throw new Error(`Template ${id} is inactive`);
const params = {
  ofsName: "OFS Exemple",
  distributorName: "Habitat Exemple",
  invitationUrl:
    "https://portal.example.test/invitation-commercialisateur?token=preview-only",
  expiresInDays: 7,
};
let preview;
let previewVerifiedByBrevo = true;
try {
  preview = await api("/smtp/template/preview", "POST", {
    templateId: id,
    params,
  });
} catch (error) {
  if (!error.message.includes("Contact not found")) throw error;
  // Some Brevo accounts require an existing contact even for params-only previews.
  // Verify the saved remote HTML and render sample values locally without creating contacts.
  previewVerifiedByBrevo = false;
  const html = template.htmlContent;
  if (typeof html !== "string")
    throw new Error(`Template ${id} has no HTML content`);
  for (const key of Object.keys(params)) {
    if (!html.includes(`{{ params.${key} }}`))
      throw new Error(`Template ${id} is missing ${key}`);
  }
  const escape = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  const render = (source) =>
    source.replace(/\{\{\s*params\.(\w+)\s*\}\}/g, (_, key) =>
      escape(params[key]),
    );
  preview = { html: render(html), subject: render(template.subject) };
}
if (
  !preview.html?.includes("OFS Exemple") ||
  !preview.html.includes("Habitat Exemple") ||
  !preview.html.includes("token=preview-only") ||
  /\{\{\s*params\./.test(preview.html)
) {
  throw new Error(`Template ${id} did not render all invitation parameters`);
}
const previewPath = "/tmp/boris-brevo-invitation-preview.html";
fs.writeFileSync(previewPath, preview.html);
const envLine = `DISTRIBUTOR_INVITATION_TEMPLATE_ID=${id}`;
const updated = /^DISTRIBUTOR_INVITATION_TEMPLATE_ID=.*$/m.test(envContent)
  ? envContent.replace(/^DISTRIBUTOR_INVITATION_TEMPLATE_ID=.*$/m, envLine)
  : `${envContent.trimEnd()}\n${envLine}\n`;
fs.writeFileSync(envPath, updated);
console.log(
  JSON.stringify({
    id,
    name: template.name,
    active: template.isActive,
    subject: preview.subject,
    previewPath,
    previewVerifiedByBrevo,
    localEnvironmentConfigured: true,
    emailsSent: 0,
  }),
);
