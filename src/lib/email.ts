interface EmailVars {
  url?: string;
  name?: string;
  subject?: string;
  content?: string;
  [key: string]: string | undefined;
}

interface EmailTemplate {
  subject: string;
  html: (vars: EmailVars) => string;
}

// Function to generate watermark HTML
const generateWatermark = (email: string) => {
  const timestamp = new Date().toISOString();
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
      <tr>
        <td align="right" style="
          padding: 10px 20px;
          font-size: 8px;
          color: rgba(220, 225, 222, 0.2);
          font-family: Arial, sans-serif;
          border-top: 1px solid rgba(220, 225, 222, 0.1);
        ">
          ${email} | ${timestamp}
        </td>
      </tr>
    </table>
  `;
};

const templates: Record<string, EmailTemplate> = {
  welcome: {
    subject: "Welcome to The Catalyst - Your Journey Begins Here",
    html: (vars) => `
      <table width="100%" cellpadding="0" cellspacing="0" style="
        background-color: #1a1a1a;
        color: #ffffff;
        font-family: Arial, sans-serif;
      ">
        <tr>
          <td align="center" style="padding: 40px;">
            <!-- Header -->
            <div style="
              font-size: 24px;
              font-weight: bold;
              color: #ffffff;
              margin-bottom: 30px;
              text-align: center;
            ">
              What Comes Next? LLC
            </div>

            <!-- Content Container -->
            <table width="600px" style="
              background-color: rgba(33, 104, 105, 0.3);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 12px;
              padding: 30px;
            ">
              <tr>
                <td>
                  <h2 style="color: #dce1de; margin-bottom: 20px;">Welcome to The Catalyst, ${vars.name}</h2>
                  <p style="color: #dce1de; margin-bottom: 20px;">Your transformation journey begins now. We've created your personal access link:</p>
                  <p style="margin: 20px 0; text-align: center;">
                    <a href="${vars.url}" 
                       style="
                         background: #216869;
                         color: #dce1de;
                         padding: 12px 24px;
                         text-decoration: none;
                         border-radius: 8px;
                         display: inline-block;
                       ">
                      Access Your Dashboard
                    </a>
                  </p>
                  <p style="color: #dce1de; font-size: 14px; text-align: center;">
                    Or copy this URL: ${vars.url}
                  </p>
                  <p style="color: #dce1de; margin-top: 20px;">Let's build what comes next, together.</p>
                </td>
              </tr>
            </table>
            ${generateWatermark(vars.url?.split('?')[0] || '')}
          </td>
        </tr>
      </table>
    `
  },
  broadcast: {
    subject: "{{subject}}",
    html: (vars) => `
      <table width="100%" cellpadding="0" cellspacing="0" style="
        background-color: #1a1a1a;
        color: #ffffff;
        font-family: Arial, sans-serif;
      ">
        <tr>
          <td align="center" style="padding: 40px;">
            <!-- Header -->
            <div style="
              font-size: 24px;
              font-weight: bold;
              color: #ffffff;
              margin-bottom: 30px;
              text-align: center;
            ">
              What Comes Next? LLC
            </div>

            <!-- Content Container -->
            <table width="600px" style="
              background-color: rgba(33, 104, 105, 0.3);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 12px;
              padding: 30px;
            ">
              <tr>
                <td>
                  <h1 style="color: #dce1de; font-size: 24px; margin-bottom: 20px;">${vars.subject}</h1>
                  <pre style="
                    color: #dce1de;
                    white-space: pre-wrap;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    background: transparent;
                  ">${vars.content}</pre>
                </td>
              </tr>
            </table>
            ${generateWatermark(vars.to || '')}
          </td>
        </tr>
      </table>
    `
  },
  individual: {
    subject: "{{subject}}",
    html: (vars) => `
      <table width="100%" cellpadding="0" cellspacing="0" style="
        background-color: #1a1a1a;
        color: #ffffff;
        font-family: Arial, sans-serif;
      ">
        <tr>
          <td align="center" style="padding: 40px;">
            <!-- Header -->
            <div style="
              font-size: 24px;
              font-weight: bold;
              color: #ffffff;
              margin-bottom: 30px;
              text-align: center;
            ">
              What Comes Next? LLC
            </div>

            <!-- Content Container -->
            <table width="600px" style="
              background-color: rgba(33, 104, 105, 0.3);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 12px;
              padding: 30px;
            ">
              <tr>
                <td>
                  <h1 style="color: #dce1de; font-size: 24px; margin-bottom: 20px;">${vars.subject}</h1>
                  <pre style="
                    color: #dce1de;
                    white-space: pre-wrap;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    background: transparent;
                  ">${vars.content}</pre>
                  <div style="
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(220, 225, 222, 0.2);
                  ">
                    <p style="color: #dce1de;">Best regards,<br>The Catalyst Team</p>
                  </div>
                </td>
              </tr>
            </table>
            ${generateWatermark(vars.to || '')}
          </td>
        </tr>
      </table>
    `
  }
};

// Get the mailer endpoint from environment variables or use defaults
const getMailerEndpoint = () => {
  // Use environment variable if available
  if (process.env.NEXT_PUBLIC_MAILER_ENDPOINT) {
    return process.env.NEXT_PUBLIC_MAILER_ENDPOINT;
  }
  
  // Fall back to environment-based defaults
  if (process.env.NODE_ENV === 'production') {
    return 'https://mail.whatcomesnextllc.ai/send';
  }
  
  // Development default
  return 'http://laundryroom:3000/send-email';
};

export async function dispatchEmail(
  template: keyof typeof templates,
  to: string,
  vars: EmailVars
) {
  const emailTemplate = templates[template];
  if (!emailTemplate) throw new Error(`Template ${template} not found`);

  try {
    const mailerEndpoint = getMailerEndpoint();
    const response = await fetch(mailerEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to,
        subject: template === 'broadcast' || template === 'individual' ? vars.subject : emailTemplate.subject,
        html: emailTemplate.html({ ...vars, to })
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return true;
  } catch (error) {
    console.error('Email dispatch error:', error);
    return false;
  }
} 