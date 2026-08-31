import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

function getFrom() {
  return process.env.EMAIL_FROM || "DripBazzardz <no-reply@dripbazzardz.com>";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendOrderConfirmationEmail(options: {
  to: string;
  firstName?: string;
  lastName?: string;
  orderNumber: string;
  createdAt: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  status?: string;
}) {
  if (!resend) return;

  const name = [options.firstName, options.lastName].filter(Boolean).join(" ") || "Client";

  const itemsHtml = options.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.08);color:#e5e5e5;font-size:14px;">${escapeHtml(item.name)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.08);color:#e5e5e5;font-size:14px;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.08);color:#e5e5e5;font-size:14px;text-align:right;">${item.price.toLocaleString("fr-FR")} DA</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="background:#000;color:#fff;font-family:Inter,sans-serif;padding:24px 0;">
      <div style="max-width:640px;margin:0 auto;background:#0a0a0a;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:28px;">
        <div style="text-align:center;margin-bottom:20px;">
          <div style="font-size:22px;font-weight:900;letter-spacing:0.08em;">DRIPBAZZARDZ</div>
          <div style="color:#a3a3a3;font-size:13px;margin-top:6px;">Confirmation de commande</div>
        </div>

        <p style="color:#e5e5e5;font-size:15px;line-height:1.6;">Bonjour ${escapeHtml(name)},</p>
        <p style="color:#e5e5e5;font-size:15px;line-height:1.6;">Nous avons bien reçu votre commande <strong>#${escapeHtml(options.orderNumber)}</strong>.</p>

        <table style="width:100%;border-collapse:collapse;margin:18px 0;">
          <thead>
            <tr>
              <th style="padding:10px 12px;text-align:left;color:#a3a3a3;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.12);">Produit</th>
              <th style="padding:10px 12px;text-align:center;color:#a3a3a3;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.12);">Qté</th>
              <th style="padding:10px 12px;text-align:right;color:#a3a3a3;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.12);">Prix</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="text-align:right;color:#fff;font-weight:700;font-size:16px;margin-bottom:18px;">Total : ${options.total.toLocaleString("fr-FR")} DA</div>

        <div style="background:#ffffff;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:16px;color:#171717;font-size:14px;line-height:1.6;">
          <div style="font-weight:700;margin-bottom:8px;">Adresse de livraison</div>
          <div>${escapeHtml(name)}</div>
          ${options.address ? `<div>${escapeHtml(options.address)}</div>` : ""}
          <div>${[options.city, options.postalCode, options.country].filter(Boolean).join(", ")}</div>
          ${options.phone ? `<div>${escapeHtml(options.phone)}</div>` : ""}
          ${options.status ? `<div style="margin-top:8px;color:#525252;">Statut : ${escapeHtml(options.status)}</div>` : ""}
        </div>

        <div style="text-align:center;margin-top:22px;color:#a3a3a3;font-size:12px;">Merci pour votre commande chez DripBazzardz.</div>
      </div>
    </div>
  `;

  return resend.emails.send({
    from: getFrom(),
    to: options.to,
    subject: `Confirmation de votre commande #${options.orderNumber}`,
    html,
  });
}

export async function sendOrderStatusEmail(options: {
  to: string;
  firstName?: string;
  lastName?: string;
  orderNumber: string;
  status: string;
}) {
  if (!resend) return;

  const name = [options.firstName, options.lastName].filter(Boolean).join(" ") || "Client";

  const statusCopy: Record<string, { subject: string; body: string }> = {
    confirmed: {
      subject: `Votre commande #${options.orderNumber} a été confirmée`,
      body: `Votre commande #${options.orderNumber} est confirmée.`,
    },
    shipped: {
      subject: `Votre commande #${options.orderNumber} a été expédiée`,
      body: `Votre commande #${options.orderNumber} a été expédiée.`,
    },
    delivered: {
      subject: `Votre commande #${options.orderNumber} a été livrée`,
      body: `Votre commande #${options.orderNumber} a été livrée.`,
    },
    cancelled: {
      subject: `Votre commande #${options.orderNumber} a été annulée`,
      body: `Votre commande #${options.orderNumber} a été annulée.`,
    },
  };

  const copy = statusCopy[options.status] || {
    subject: `Mise à jour de votre commande #${options.orderNumber}`,
    body: `Le statut de votre commande #${options.orderNumber} a été mis à jour.`,
  };

  const html = `
    <div style="background:#000;color:#fff;font-family:Inter,sans-serif;padding:24px 0;">
      <div style="max-width:640px;margin:0 auto;background:#0a0a0a;border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:28px;">
        <div style="text-align:center;margin-bottom:20px;">
          <div style="font-size:22px;font-weight:900;letter-spacing:0.08em;">DRIPBAZZARDZ</div>
          <div style="color:#a3a3a3;font-size:13px;margin-top:6px;">Mise à jour de commande</div>
        </div>
        <p style="color:#e5e5e5;font-size:15px;line-height:1.6;">Bonjour ${escapeHtml(name)},</p>
        <p style="color:#e5e5e5;font-size:15px;line-height:1.6;">${escapeHtml(copy.body)}</p>
        <div style="text-align:center;margin-top:22px;color:#a3a3a3;font-size:12px;">DripBazzardz</div>
      </div>
    </div>
  `;

  return resend.emails.send({
    from: getFrom(),
    to: options.to,
    subject: copy.subject,
    html,
  });
}
