# Инструкция по подключению по SSH

## Что такое SSH?

SSH (Secure Shell) - это протокол для безопасного подключения к удаленным серверам и выполнения команд.

## Шаг 1: Проверка наличия SSH на вашем компьютере

На macOS SSH обычно уже установлен. Проверьте:

```bash
ssh -V
```

Должна отобразиться версия SSH.

## Шаг 2: Генерация SSH ключа (если еще нет)

Если у вас еще нет SSH ключа, создайте его:

```bash
ssh-keygen -t ed25519 -C "ваш-email@example.com"
```

Или используйте RSA (если ed25519 не поддерживается):

```bash
ssh-keygen -t rsa -b 4096 -C "ваш-email@example.com"
```

**Важно:**
- Нажмите Enter для сохранения в стандартное место (`~/.ssh/id_ed25519` или `~/.ssh/id_rsa`)
- Можно установить пароль для ключа (рекомендуется) или оставить пустым
- **Никогда не делитесь приватным ключом!**

## Шаг 3: Просмотр публичного ключа

После создания ключа, посмотрите публичный ключ:

```bash
cat ~/.ssh/id_ed25519.pub
```

Или для RSA:

```bash
cat ~/.ssh/id_rsa.pub
```

Скопируйте весь вывод - это ваш публичный ключ.

## Шаг 4: Подключение к серверу

### Вариант A: Подключение по паролю

```bash
ssh username@server-ip-address
```

Например:
```bash
ssh root@192.168.1.100
```

Или с указанием порта (если не стандартный 22):
```bash
ssh -p 2222 username@server-ip-address
```

### Вариант B: Подключение по SSH ключу

1. **Добавьте публичный ключ на сервер:**

   На сервере выполните (или попросите администратора):
   ```bash
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   echo "ваш-публичный-ключ" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

2. **Подключитесь:**
   ```bash
   ssh username@server-ip-address
   ```

### Вариант C: Использование SSH конфига (рекомендуется)

Создайте файл `~/.ssh/config`:

```bash
nano ~/.ssh/config
```

Добавьте конфигурацию:

```
Host myserver
    HostName server-ip-address
    User username
    Port 22
    IdentityFile ~/.ssh/id_ed25519
```

Теперь можно подключаться просто:
```bash
ssh myserver
```

## Шаг 5: Подключение к популярным сервисам

### GitHub

1. Добавьте публичный ключ на GitHub:
   - Settings → SSH and GPG keys → New SSH key
   - Вставьте ваш публичный ключ

2. Проверьте подключение:
   ```bash
   ssh -T git@github.com
   ```

3. Используйте SSH URL для клонирования:
   ```bash
   git clone git@github.com:username/repository.git
   ```

### DigitalOcean, AWS, Vultr и другие VPS

1. При создании сервера добавьте ваш публичный SSH ключ
2. Подключитесь:
   ```bash
   ssh root@your-server-ip
   ```

## Шаг 6: Деплой проекта на сервер по SSH

### Подготовка сервера

1. Подключитесь к серверу:
   ```bash
   ssh username@server-ip
   ```

2. Установите необходимые инструменты:
   ```bash
   # Обновление системы (Ubuntu/Debian)
   sudo apt update && sudo apt upgrade -y
   
   # Установка Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Установка Git
   sudo apt install git -y
   
   # Установка PM2 (для управления Node.js процессами)
   sudo npm install -g pm2
   ```

3. Клонируйте проект:
   ```bash
   cd /var/www
   git clone git@github.com:username/DevBlog.git
   cd DevBlog
   ```

4. Установите зависимости:
   ```bash
   npm run install-all
   ```

5. Настройте .env файл:
   ```bash
   cd server
   nano .env
   ```

   Добавьте:
   ```env
   PORT=5000
   JWT_SECRET=your-production-secret-key
   NODE_ENV=production
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   FRONTEND_URL=https://yourdomain.com
   ```

6. Соберите frontend:
   ```bash
   cd ../client
   npm run build
   ```

7. Запустите сервер с PM2:
   ```bash
   cd ../server
   pm2 start index.js --name devblog
   pm2 save
   pm2 startup
   ```

### Настройка Nginx (опционально)

Для обслуживания статических файлов и проксирования:

```bash
sudo apt install nginx -y
```

Создайте конфиг:
```bash
sudo nano /etc/nginx/sites-available/devblog
```

Добавьте:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/DevBlog/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активируйте:
```bash
sudo ln -s /etc/nginx/sites-available/devblog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Полезные SSH команды

```bash
# Подключение
ssh username@server-ip

# Выполнение команды на удаленном сервере без входа
ssh username@server-ip "команда"

# Копирование файла на сервер
scp file.txt username@server-ip:/path/to/destination

# Копирование файла с сервера
scp username@server-ip:/path/to/file.txt ./

# Копирование папки
scp -r folder username@server-ip:/path/to/destination

# Туннелирование портов (для доступа к локальному серверу через SSH)
ssh -L 3000:localhost:3000 username@server-ip

# Отключение от сервера
exit
# или нажмите Ctrl+D
```

## Безопасность

1. **Используйте SSH ключи вместо паролей**
2. **Отключите вход по паролю** (на сервере):
   ```bash
   sudo nano /etc/ssh/sshd_config
   ```
   Установите:
   ```
   PasswordAuthentication no
   ```
   Перезапустите SSH:
   ```bash
   sudo systemctl restart sshd
   ```

3. **Измените стандартный порт SSH** (опционально):
   В `/etc/ssh/sshd_config`:
   ```
   Port 2222
   ```

4. **Используйте файрвол:**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```

## Решение проблем

### Ошибка "Permission denied (publickey)"
- Убедитесь, что публичный ключ добавлен на сервер
- Проверьте права доступа: `chmod 600 ~/.ssh/id_ed25519`

### Ошибка "Connection refused"
- Проверьте, что SSH сервис запущен на сервере
- Проверьте файрвол
- Проверьте правильность IP адреса и порта

### Ошибка "Host key verification failed"
```bash
ssh-keygen -R server-ip-address
```

## Дополнительные ресурсы

- [Официальная документация OpenSSH](https://www.openssh.com/)
- [GitHub: Настройка SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

