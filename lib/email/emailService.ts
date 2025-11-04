import nodemailer, { Transporter } from 'nodemailer';

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendAuthCode(email: string, code: string): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
            border-radius: 16px;
            padding: 40px;
            text-align: center;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            background: linear-gradient(to right, #3b82f6, #22d3ee);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 24px;
          }
          .title {
            color: #ffffff;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 16px;
          }
          .description {
            color: #9ca3af;
            font-size: 16px;
            margin-bottom: 32px;
          }
          .code-container {
            background: rgba(59, 130, 246, 0.1);
            border: 2px solid rgba(59, 130, 246, 0.3);
            border-radius: 12px;
            padding: 24px;
            margin: 32px 0;
          }
          .code {
            font-size: 48px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #3b82f6;
            font-family: 'Courier New', monospace;
          }
          .expiry {
            color: #9ca3af;
            font-size: 14px;
            margin-top: 16px;
          }
          .footer {
            color: #6b7280;
            font-size: 12px;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
          .warning {
            background: rgba(239, 68, 68, 0.1);
            border-left: 4px solid #ef4444;
            padding: 12px;
            margin-top: 24px;
            border-radius: 4px;
            color: #fca5a5;
            font-size: 14px;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Biveki</div>
          <h1 class="title">Код для входа</h1>
          <p class="description">
            Используйте этот код для авторизации в системе Biveki
          </p>

          <div class="code-container">
            <div class="code">${code}</div>
            <p class="expiry">Код действителен в течение 10 минут</p>
          </div>

          <div class="warning">
            <strong>⚠️ Важно:</strong> Никогда не передавайте этот код третьим лицам.
            Сотрудники Biveki никогда не попросят вас предоставить этот код.
          </div>

          <div class="footer">
            <p>Если вы не запрашивали этот код, проигнорируйте это письмо.</p>
            <p>© 2025 Biveki. Все права защищены.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Ваш код для входа в Biveki: ${code}

Код действителен в течение 10 минут.

Если вы не запрашивали этот код, проигнорируйте это письмо.

© 2025 Biveki
  `;

  try {
    await transporter.sendMail({
      from: `"Biveki" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: `Ваш код для входа: ${code}`,
      text,
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send authentication code');
  }
}

// Отправка уведомления о новой заявке
export async function sendContactFormNotification(
  name: string,
  email: string,
  phone: string | null,
  project: string
): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
            border-radius: 16px;
            padding: 40px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            background: linear-gradient(to right, #3b82f6, #22d3ee);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 24px;
          }
          .title {
            color: #ffffff;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 16px;
          }
          .description {
            color: #9ca3af;
            font-size: 16px;
            margin-bottom: 32px;
          }
          .field {
            background: rgba(59, 130, 246, 0.1);
            border-left: 4px solid #3b82f6;
            padding: 16px;
            margin: 16px 0;
            border-radius: 4px;
          }
          .field-label {
            color: #9ca3af;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          .field-value {
            color: #ffffff;
            font-size: 16px;
            word-wrap: break-word;
          }
          .project-description {
            background: rgba(34, 211, 238, 0.1);
            border-left: 4px solid #22d3ee;
            padding: 16px;
            margin: 24px 0;
            border-radius: 4px;
          }
          .footer {
            color: #6b7280;
            font-size: 12px;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">Biveki</div>
          <h1 class="title">Новая заявка с сайта</h1>
          <p class="description">
            Получена новая заявка от потенциального клиента
          </p>

          <div class="field">
            <div class="field-label">Имя</div>
            <div class="field-value">${name}</div>
          </div>

          <div class="field">
            <div class="field-label">Email</div>
            <div class="field-value"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></div>
          </div>

          ${phone ? `
          <div class="field">
            <div class="field-label">Телефон</div>
            <div class="field-value"><a href="tel:${phone}" style="color: #3b82f6; text-decoration: none;">${phone}</a></div>
          </div>
          ` : ''}

          <div class="project-description">
            <div class="field-label">Описание проекта</div>
            <div class="field-value" style="margin-top: 8px; white-space: pre-wrap;">${project}</div>
          </div>

          <div class="footer">
            <p>Не забудьте обработать эту заявку в панели управления.</p>
            <p>© 2025 Biveki. Все права защищены.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Новая заявка с сайта Biveki

Имя: ${name}
Email: ${email}
${phone ? `Телефон: ${phone}` : ''}

Описание проекта:
${project}

Не забудьте обработать эту заявку в панели управления.

© 2025 Biveki
  `;

  try {
    await transporter.sendMail({
      from: `"Biveki - Заявки" <${process.env.FROM_EMAIL}>`,
      to: process.env.FROM_EMAIL, // Отправляем админу
      subject: `Новая заявка от ${name}`,
      text,
      html,
    });
  } catch (error) {
    console.error('Error sending contact form notification:', error);
    throw new Error('Failed to send contact form notification');
  }
}

// Тестовая функция для проверки SMTP подключения
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('SMTP connection error:', error);
    return false;
  }
}
