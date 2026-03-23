## Existing Database Schema: recipes

The application integrates with an existing Supabase table named `recipes`.
This schema is considered **source of truth** and must be reused as-is.

### Constraints

- The `recipes` table already exists.
- No schema changes or migrations are allowed.
- Field names and data types must match exactly.
- Application code must adapt to this schema.

### Table Definition

| Column Name             | Type        | Nullable | Default           |
| ----------------------- | ----------- | -------- | ----------------- |
| id                      | uuid        | NO       | gen_random_uuid() |
| title                   | text        | NO       | —                 |
| servings                | text        | NO       | —                 |
| preparation_time        | text        | NO       | —                 |
| ingredients             | jsonb       | NO       | []                |
| preparation             | jsonb       | NO       | []                |
| nutritional_information | jsonb       | YES      | null              |
| complementaries         | jsonb       | NO       | []                |
| created_at              | timestamptz | NO       | now()             |
| updated_at              | timestamptz | NO       | now()             |

### Allowed Operations

- INSERT new recipes
- SELECT existing recipes

### Out of Scope

- Schema migrations
- Column renames or type changes
