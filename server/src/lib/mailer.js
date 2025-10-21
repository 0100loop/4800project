import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function sendWelcomeEmail(to, name, role) {
  const subject = role === "lister" ? "Welcome to ParkIt (Host)" : "Welcome to ParkIt!";
  const html = `
    <div style="font-family:system-ui,Arial">
      <h2>Welcome, ${name} 👋</h2>
      <p>Thanks for joining ParkIt as a <b>${role}</b>.</p>
      <ul>
        <li>Find & reserve driveway parking near stadiums (Users)</li>
        <li>List your driveway, set prices, get paid (Hosts)</li>
      </ul>
      <p>Happy parking,<br/>ParkIt Team</p>
    </div>`;
  await transporter.sendMail({
    from: process.env.FROM_EMAIL || "no-reply@parkit.app",
    to, subject, html
  });
}
