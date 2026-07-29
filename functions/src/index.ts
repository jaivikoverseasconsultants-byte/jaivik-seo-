import { onSchedule } from 'firebase-functions/v2/scheduler';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

initializeApp();

const brevoApiKey = defineSecret('BREVO_API_KEY');

const INACTIVITY_MS   = 5 * 24 * 60 * 60 * 1000; // 5 days
const SENDER_EMAIL    = 'info@jaivikoverseasconsultants.com';
const SENDER_NAME     = 'Gaurav Katyal | Jaivik Overseas';
const WA_REACTIVATE   = 'https://wa.me/919971226347?text=Please+reactivate+my+Jaivik+Overseas+portal+account';
const SITE_URL        = 'https://study.jaivikoverseasconsultants.com';

// ── Scheduled: daily at midnight IST ────────────────────────────────────────
export const deactivateInactiveStudents = onSchedule(
  {
    schedule: '0 0 * * *',   // midnight every day
    timeZone: 'Asia/Kolkata',
    secrets: [brevoApiKey],
  },
  async () => {
    const db = getFirestore();
    const cutoffMs = Date.now() - INACTIVITY_MS;

    // Fetch all active student accounts
    const { docs } = await db.collection('users')
      .where('status', '==', 'active')
      .get();

    // Filter to those whose lastActivity is older than the cutoff
    const stale = docs.filter((d) => {
      const last = d.data().lastActivity as Timestamp | undefined;
      return last != null && last.toMillis() <= cutoffMs;
    });

    console.log(`[Deactivation] ${docs.length} active users checked, ${stale.length} to deactivate`);

    await Promise.all(
      stale.map(async (d) => {
        const data = d.data() as { email: string; name: string; lastActivity: Timestamp };
        try {
          await d.ref.update({
            status: 'deactivated',
            deactivatedAt: Timestamp.now(),
            deactivationReason: 'inactivity_5days',
          });
          await sendDeactivationEmail(
            brevoApiKey.value(),
            data.email,
            data.name ?? 'Student',
          );
          console.log(`[Deactivation] uid=${d.id} email=${data.email} — done`);
        } catch (err) {
          console.error(`[Deactivation] uid=${d.id} failed:`, err);
        }
      }),
    );
  },
);

// ── Email helpers ─────────────────────────────────────────────────────────────

async function sendDeactivationEmail(apiKey: string, email: string, fullName: string): Promise<void> {
  const firstName = (fullName || 'Student').split(' ')[0];
  const subject   = `${firstName}, your Jaivik Overseas account has been deactivated`;
  const html      = buildDeactivationEmail(firstName);

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email, name: fullName }],
        subject,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[Brevo] Deactivation email to ${email} failed (${res.status}):`, err);
    } else {
      console.log(`[Brevo] Deactivation email sent → ${email}`);
    }
  } catch (err) {
    console.error(`[Brevo] Network error sending to ${email}:`, err);
  }
}

function buildDeactivationEmail(firstName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Account Deactivated</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;">
<tr><td align="center" style="padding:32px 16px;">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10);">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#1e3a8a 0%,#1e40af 100%);padding:36px 40px;text-align:center;">
    <p style="color:#d97706;font-size:12px;font-weight:700;margin:0 0 10px;letter-spacing:1.5px;text-transform:uppercase;">Jaivik Overseas Consultants</p>
    <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 8px;line-height:1.4;">Account Deactivated</h1>
    <p style="color:#93c5fd;font-size:14px;margin:0;">We noticed you haven't been active recently</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:36px 40px;">
    <p style="color:#1e293b;font-size:16px;margin:0 0 16px;font-weight:600;">Hi ${firstName},</p>
    <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Your Jaivik Overseas student portal account has been <strong>temporarily deactivated</strong> due to 5 days of inactivity since registration.
    </p>

    <!-- Info box -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fefce8;border-radius:12px;border:1px solid #fde68a;margin-bottom:24px;">
    <tr><td style="padding:20px 24px;">
      <p style="color:#92400e;font-weight:700;font-size:14px;margin:0 0 8px;">Why was my account deactivated?</p>
      <p style="color:#78350f;font-size:13px;line-height:1.7;margin:0;">
        We deactivate accounts that have had no activity for 5 days to keep our portal secure and
        our counsellors&rsquo; attention focused on active students. Your data is safe and your account
        can be reactivated within minutes.
      </p>
    </td></tr>
    </table>

    <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 28px;">
      To reactivate your account and continue tracking your applications, IELTS scores, and visa status &mdash;
      simply WhatsApp us and we&rsquo;ll restore your access immediately.
    </p>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;margin-bottom:28px;">
    <tr><td style="padding:28px;text-align:center;">
      <p style="color:#166534;font-weight:700;font-size:16px;margin:0 0 6px;">Reactivate your account in 2 minutes</p>
      <p style="color:#15803d;font-size:13px;margin:0 0 20px;">WhatsApp Mr. Gaurav Katyal directly &mdash; we respond within the hour.</p>
      <a href="${WA_REACTIVATE}" style="background:#16a34a;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:14px;display:inline-block;">
        WhatsApp +91-9971226347 &#8250;
      </a>
    </td></tr>
    </table>

    <p style="color:#94a3b8;font-size:13px;line-height:1.7;margin:0 0 24px;">
      You can also reach us at <a href="mailto:${SENDER_EMAIL}" style="color:#1e40af;">${SENDER_EMAIL}</a>
      or visit <a href="${SITE_URL}" style="color:#1e40af;">our website</a>.
    </p>
  </td></tr>

  <!-- Signature -->
  <tr><td style="padding:0 40px 28px;border-top:1px solid #f1f5f9;">
    <p style="color:#64748b;font-size:14px;margin:0 0 4px;">Warm regards,</p>
    <p style="color:#1e40af;font-weight:700;font-size:15px;margin:0 0 2px;">Gaurav Katyal</p>
    <p style="color:#64748b;font-size:13px;margin:0;">Senior Education Consultant &mdash; Jaivik Overseas Consultants</p>
    <p style="color:#94a3b8;font-size:12px;margin:8px 0 0;">+91-9971226347 &nbsp;|&nbsp; jaivikoverseasconsultants.com &nbsp;|&nbsp; 13 years &bull; 99% visa success</p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f8fafc;padding:18px 40px;text-align:center;border-top:1px solid #e2e8f0;">
    <p style="color:#94a3b8;font-size:11px;line-height:1.6;margin:0;">
      You are receiving this because you registered with Jaivik Overseas Consultants.<br>
      To unsubscribe, reply with &ldquo;unsubscribe&rdquo;.
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
