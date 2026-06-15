# Estrutura do Banco de Dados — Glix

## Tabela: profiles

| Campo | Tipo |
|---|---|
| id | uuid |
| email | text |
| name | text |
| plan | text |
| created_at | timestamp |

---

## Tabela: glucose_records

| Campo | Tipo |
|---|---|
| id | uuid |
| user_id | uuid |
| value_mg_dl | numeric |
| measurement_context | text |
| measured_at | timestamp |
| notes | text |
| created_at | timestamp |

---

## Regras de Segurança

- Row Level Security ativado
- Cada usuário acessa apenas seus próprios dados
- Autenticação via Supabase Auth
