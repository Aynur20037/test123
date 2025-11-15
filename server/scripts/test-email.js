require('dotenv').config();
const { sendPasswordResetEmail } = require('../utils/email');

async function testEmail() {
  try {
    console.log('📧 Тестирование отправки email...\n');
    
    // Проверка настроек
    console.log('Проверка настроек:');
    console.log('GMAIL_USER:', process.env.GMAIL_USER ? '✅ Установлен' : '❌ Не установлен');
    console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '✅ Установлен' : '❌ Не установлен');
    console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:3000');
    console.log('');

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('❌ Ошибка: Gmail настройки не найдены в .env файле');
      console.log('\nДобавьте в server/.env:');
      console.log('GMAIL_USER=ваш-email@gmail.com');
      console.log('GMAIL_APP_PASSWORD=ваш-app-password');
      process.exit(1);
    }

    if (process.env.GMAIL_USER === 'your-email@gmail.com' || 
        process.env.GMAIL_APP_PASSWORD === 'your-app-password') {
      console.error('❌ Ошибка: Используются значения по умолчанию');
      console.log('\nЗамените в server/.env:');
      console.log('your-email@gmail.com → ваш реальный Gmail');
      console.log('your-app-password → ваш App Password от Gmail');
      process.exit(1);
    }

    // Тестовая отправка
    const testEmail = process.env.GMAIL_USER; // Отправляем на тот же email
    const testToken = 'test-token-12345';
    
    console.log('Отправка тестового письма на:', testEmail);
    await sendPasswordResetEmail(testEmail, testToken);
    
    console.log('\n✅ Тестовое письмо успешно отправлено!');
    console.log('Проверьте папку "Входящие" и "Спам" в Gmail.');
    
  } catch (error) {
    console.error('\n❌ Ошибка:', error.message);
    
    if (error.message.includes('аутентификации')) {
      console.log('\n💡 Решение:');
      console.log('1. Убедитесь, что используете App Password, а не обычный пароль');
      console.log('2. Проверьте, что двухфакторная аутентификация включена');
      console.log('3. Создайте новый App Password: https://myaccount.google.com/apppasswords');
    } else if (error.message.includes('настройки не найдены')) {
      console.log('\n💡 Решение:');
      console.log('Добавьте настройки в server/.env файл');
    }
    
    process.exit(1);
  }
}

testEmail();

