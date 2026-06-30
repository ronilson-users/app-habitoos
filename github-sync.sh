#!/data/data/com.termux/files/usr/bin/bash

# =====================================
# 🚀 AUTOMAÇÃO DE SINCRONIZAÇÃO GITHUB
# Compatível Termux / Android
# =====================================

set -e  # Parar em caso de erro

# =====================================
# 🔧 Configuração
# =====================================
GITHUB_USERNAME="ronilson-users"
REPO_NAME="app-habitoos"
PROJECT_DIR="/data/data/com.termux/files/home/2026/app-habitoos"
GITHUB_EMAIL="ronilson.stos@gmail.com"

# Ir para o diretório do projeto
cd "$PROJECT_DIR" || { 
    echo "❌ Diretório não encontrado: $PROJECT_DIR" 
    exit 1 
}

echo "📁 Diretório: $(pwd)"
echo "🚀 Iniciando sincronização: $REPO_NAME"

# =====================================
# 🔐 Obter Token GitHub (via terminal)
# =====================================
if [ -n "$1" ]; then
    GITHUB_TOKEN="$1"
    echo "🔑 Token recebido via argumento."
else
    echo "🔑 Digite seu token GitHub (não aparecerá na tela):"
    read -s GITHUB_TOKEN
    echo
fi

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Token vazio. Abortando."
    exit 1
fi

# Verificar formato básico
if [[ ! "$GITHUB_TOKEN" =~ ^(ghp_|github_pat_) ]]; then
    echo "❌ Token inválido. Formato esperado: ghp_... ou github_pat_..."
    exit 1
fi

# =====================================
# 🔍 Testar token GitHub
# =====================================
echo "🔍 Verificando token GitHub..."
USER_CHECK=$(curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user)

if echo "$USER_CHECK" | grep -q '"login"'; then
    echo "✅ Token válido para usuário: $(echo "$USER_CHECK" | grep -o '"login":"[^"]*"' | cut -d: -f2 | tr -d '"')"
else
    echo "❌ Token inválido ou sem conexão."
    exit 1
fi

# =====================================
# ⚙️ Inicialização Git
# =====================================
echo "⚙️ Configurando Git..."

if [ ! -d .git ]; then
    echo "🆕 Inicializando novo repositório Git..."
    git init
fi

git config user.name "$GITHUB_USERNAME"
git config user.email "$GITHUB_EMAIL"

# Configurar remote com token temporário
REMOTE_URL="https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
if git remote get-url origin >/dev/null 2>&1; then
    git remote set-url origin "$REMOTE_URL"
else
    git remote add origin "$REMOTE_URL"
fi

echo "✅ Git configurado."

# =====================================
# 📝 Criar repositório no GitHub se não existir
# =====================================
echo "🔍 Verificando repositório no GitHub..."
REPO_CHECK=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME})

if ! echo "$REPO_CHECK" | grep -q '"name"'; then
    echo "🆕 Criando repositório no GitHub..."
    curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" \
         -H "Accept: application/vnd.github.v3+json" \
         https://api.github.com/user/repos \
         -d "{\"name\":\"$REPO_NAME\",\"private\":false}" > /dev/null
    
    echo "✅ Repositório criado: $REPO_NAME"
fi

# =====================================
# 📄 Criar arquivos padrão se necessário
# =====================================
if [ ! -f README.md ]; then
    echo "📄 Criando README.md..."
    cat > README.md << EOF
# $REPO_NAME

Projeto sincronizado automaticamente via script Termux.
EOF
fi

if [ ! -f .gitignore ]; then
    echo "📄 Criando .gitignore..."
    cat > .gitignore << EOF
node_modules/
.env
.env.local
dist/
build/
*.log
EOF
fi

# =====================================
# 💾 Commit
# =====================================
echo "💾 Adicionando arquivos..."
git add .

if git diff --cached --quiet; then
    echo "✅ Nenhuma mudança para commitar."
else
    COMMIT_MSG="🚀 Deploy $(date '+%d/%m/%Y %H:%M')
- Sincronização automática via Termux"
    
    git commit -m "$COMMIT_MSG"
    echo "✅ Commit criado."
fi

# =====================================
# 🌿 Branch
# =====================================
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

if [ "$CURRENT_BRANCH" = "HEAD" ] || [ -z "$CURRENT_BRANCH" ]; then
    git checkout -b main
    CURRENT_BRANCH="main"
fi

if [ "$CURRENT_BRANCH" = "master" ]; then
    git branch -M main
    CURRENT_BRANCH="main"
fi

echo "🌿 Branch atual: $CURRENT_BRANCH"

# =====================================
# 🔄 Sincronizar com remoto
# =====================================
echo "🔄 Sincronizando com GitHub..."

if git ls-remote --exit-code origin main >/dev/null 2>&1; then
    echo "📥 Buscando atualizações..."
    git pull origin main --rebase --allow-unrelated-histories || git pull origin main --no-rebase
else
    echo "🆕 Primeiro push..."
fi

# =====================================
# 🚀 Push final
# =====================================
echo "📤 Enviando dados..."
git push -u origin main || git push -u origin main --force-with-lease

# =====================================
# 🧹 Limpeza de segurança
# =====================================
git remote set-url origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
unset GITHUB_TOKEN

echo ""
echo "===================================="
echo "🎉 SINCRONIZAÇÃO CONCLUÍDA COM SUCESSO!"
echo "🌍 Repositório: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo "⏰ Feito em: $(date '+%d/%m/%Y %H:%M')"
echo "===================================="