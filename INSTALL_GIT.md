# Установка Git на macOS

## Проблема
Git установлен, но не работает без Xcode Command Line Tools.

## Решение 1: Установка через диалоговое окно

1. Выполните команду:
   ```bash
   xcode-select --install
   ```

2. Должно появиться диалоговое окно "Software Update"
   - Если окно не появилось, попробуйте:
     - Закрыть и открыть терминал заново
     - Перезагрузить компьютер
     - Открыть App Store и проверить обновления

3. В диалоговом окне нажмите "Установить" (Install)

4. Дождитесь завершения установки (10-30 минут)

5. После установки перезапустите терминал

## Решение 2: Установка через Homebrew

Если у вас установлен Homebrew:

```bash
# Установить Homebrew (если еще не установлен)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Установить Git через Homebrew
brew install git
```

## Решение 3: Ручная загрузка

1. Откройте: https://developer.apple.com/download/all/
2. Войдите с Apple ID
3. Найдите "Command Line Tools for Xcode"
4. Скачайте и установите

## Решение 4: Использование GitHub Desktop

Если не хотите устанавливать Command Line Tools, можно использовать GitHub Desktop:

1. Скачайте: https://desktop.github.com/
2. Установите приложение
3. Оно включает Git и удобный интерфейс

## Проверка установки

После установки проверьте:

```bash
git --version
```

Должно показать версию Git, например: `git version 2.39.0`

## Альтернатива: Использование GitHub через веб-интерфейс

Если установка Git проблематична, можно:

1. Создать репозиторий на GitHub через веб-интерфейс
2. Загрузить файлы через веб-интерфейс GitHub (drag & drop)
3. Или использовать GitHub Desktop для синхронизации

## После установки Git

Выполните настройку:

```bash
git config --global user.name "Ваше Имя"
git config --global user.email "ваш@email.com"
```

Затем в папке проекта:

```bash
cd /Users/ainur/DevBlog
git init
git add .
git commit -m "Initial commit"
```

