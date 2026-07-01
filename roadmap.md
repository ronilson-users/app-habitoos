git status
git diff --name-only      

git add -p                    # adiciona por partes (muito útil)

Aqui está o passo a passo seguro:
1. Primeiro, veja o commit atual
git log --oneline -5
2. Faça o amend (alterar a mensagem)
git commit --amend
Isso vai abrir o editor de texto (geralmente vim ou nano).
Como editar a mensagem:
No editor que abrir, mude a mensagem para algo melhor, por exemplo:
feat: implementa telas de autenticação (login

Se você quiser mudar a mensagem sem abrir o editor (mais rápido):
git commit --amend -m "feat: implementa telas de autenticação (login e cadastro)"



Se você também quiser adicionar ou remover arquivos no último commit:
# Primeiro adicione os arquivos que faltaram
git add arquivo-que-faltou.tsx

# Depois faça o amend
git commit --amend --no-edit


Aqui está uma resposta clara e prática para o seu nível atual:
Quando criar cada tipo de branch?
Branch
Quando criar?
Propósito principal
Recomendado para você?

main
Uma única vez (no início do projeto)
Versão estável e pronta para produção
Sim (obrigatória)

develop
Uma única vez (depois do main)
Branch de integração de todas as features
Recomendado

feature/nome
Toda vez que for começar uma nova funcionalidade
Desenvolver login, cadastro, perfil, etc.
Sim, muito importante
bugfix/nome

Quando for corrigir um bug
Correções rápidas
Sim

hotfix/nome
Correção urgente em produção


Exemplo do que você deveria ter feito:
# Criar branch de desenvolvimento (uma única vez)
git checkout -b develop

# Quando for começar as telas de auth:
git checkout develop
git checkout -b feature/auth
Depois de terminar:
git checkout develop
git merge feature/auth
# (ou pull request se estiver no GitHub)
Resumo rápido para você agora:
Hoje: Crie a branch develop (se ainda não tiver)
Sempre que for começar algo novo: Crie uma feature/alguma-coisa