#!/bin/bash

echo "🚀 Настройка Git репозитория для DevBlog"
echo ""

# Проверка Git
if ! command -v git &> /dev/null; then
    echo "❌ Git не установлен. Установите Xcode Command Line Tools:"
    echo "   xcode-select --install"
    exit 1
fi

echo "✅ Git установлен"
echo ""

# Инициализация
if [ -d ".git" ]; then
    echo "⚠️  Git репозиторий уже инициализирован"
else
    echo "📦 Инициализация Git репозитория..."
    git init
    echo "✅ Репозиторий инициализирован"
fi

echo ""
echo "📝 Добавление файлов..."
git add .

echo ""
echo "💾 Создание первого коммита..."
git commit -m "Initial commit: DevBlog platform"

echo ""
echo "✅ Готово! Теперь:"
echo ""
echo "1. Создайте репозиторий на GitHub.com"
echo "2. Выполните команды, которые GitHub покажет:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/DevBlog.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "📖 Подробные инструкции в файле GITHUB_SETUP.md"
