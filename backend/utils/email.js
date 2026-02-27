/**
 * CampusLoop - Email Utility (Resend)
 * Uses Resend API for sending OTP emails.
 * Falls back to console.log if RESEND_API_KEY is not set (dev mode).
 */

const { Resend } = require('resend');

const getClient = () => process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const devLog = (to, otp, type) => {
    const label = type === 'reset' ? '🔑 Password Reset Code' : '📧 Sign-In Code';
    console.log(`\n${label} ─────────────────────────────────────`);
    console.log(`  To   : ${to}`);
    console.log(`  Code : ${otp}   ← enter this code in the app`);
    console.log(`─────────────────────────────────────────────\n`);
};

const sendOTPEmail = async (to, otp, name, type = 'verify') => {
    const client = getClient();
    if (!client) {
        devLog(to, otp, type);
        return;
    }

    const isReset  = type === 'reset';
    const subject  = isReset ? 'Reset Your CampusLoop Password' : 'Your CampusLoop Sign-In Code';
    const color    = isReset ? '#f59e0b' : '#10B981';
    const bgColor  = isReset ? '#fff7ed' : '#f0fdf4';
    const bodyText = isReset
        ? 'Use this code to reset your password:'
        : 'Use this one-time code to sign in to CampusLoop:';

    const from = process.env.EMAIL_FROM || 'CampusLoop <onboarding@resend.dev>';

    await client.emails.send({
        from,
        to: [to],
        subject,
        html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#f9fafb;padding:32px 16px;">
          <div style="background:#fff;border-radius:16px;padding:36px;text-align:center;">
            <h1 style="color:#10B981;margin:0 0 4px;font-size:28px;">CampusLoop</h1>
            <p style="color:#9ca3af;margin:0 0 28px;font-size:14px;">City University Community</p>
            ${name ? `<p style="color:#374151;font-size:15px;">Hi <strong>${name}</strong> 👋</p>` : ''}
            <p style="color:#4b5563;font-size:15px;">${bodyText}</p>
            <div style="background:${bgColor};border:2px solid ${color};border-radius:12px;padding:24px;margin:20px 0;">
              <span style="font-size:48px;font-weight:900;color:${color};letter-spacing:12px;">${otp}</span>
            </div>
            <p style="color:#9ca3af;font-size:13px;">⏱ This code expires in <strong>10 minutes</strong>.</p>
            <p style="color:#9ca3af;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        </div>`,
    });
};

const sendVerificationOTP  = (to, otp, name) => sendOTPEmail(to, otp, name, 'verify');
const sendPasswordResetOTP = (to, otp, name) => sendOTPEmail(to, otp, name, 'reset');

module.exports = { sendVerificationOTP, sendPasswordResetOTP };
