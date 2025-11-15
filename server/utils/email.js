const nodemailer = require('nodemailer');

// Создание транспортера для Gmail
const createTransporter = () => {
  // Проверка наличия настроек
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('Gmail настройки не найдены в .env файле. Проверьте GMAIL_USER и GMAIL_APP_PASSWORD');
  }

  // Проверка, что это не значения по умолчанию
  if (process.env.GMAIL_USER === 'your-email@gmail.com' || 
      process.env.GMAIL_APP_PASSWORD === 'your-app-password') {
    throw new Error('Пожалуйста, настройте Gmail в файле .env. Замените your-email@gmail.com и your-app-password на реальные значения.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD // Используйте App Password, не обычный пароль
    }
  });
};

// Отправка email для сброса пароля
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Восстановление пароля - DevBlog',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Восстановление пароля</h2>
          <p>Вы запросили сброс пароля для вашего аккаунта в DevBlog.</p>
          <p>Для сброса пароля нажмите на кнопку ниже:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Сбросить пароль
            </a>
          </div>
          <p>Или скопируйте и вставьте эту ссылку в браузер:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Ссылка действительна в течение 1 часа.<br>
            Если вы не запрашивали сброс пароля, проигнорируйте это письмо.
          </p>
        </div>
      `
    };

    // Проверка соединения
    await transporter.verify();
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Email успешно отправлен на:', email);
    return true;
  } catch (error) {
    console.error('❌ Ошибка отправки email:', error.message);
    
    // Детальная информация об ошибке
    if (error.code === 'EAUTH') {
      throw new Error('Ошибка аутентификации Gmail. Проверьте GMAIL_USER и GMAIL_APP_PASSWORD в .env файле.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Ошибка подключения к Gmail. Проверьте интернет-соединение.');
    } else if (error.message.includes('настройки не найдены') || error.message.includes('настройте Gmail')) {
      throw error;
    } else {
      throw new Error(`Ошибка отправки email: ${error.message}`);
    }
  }
};

module.exports = {
  sendPasswordResetEmail
};

