| column_name             | data_type                | is_nullable | column_default    |
| ----------------------- | ------------------------ | ----------- | ----------------- |
| id                      | uuid                     | NO          | gen_random_uuid() |
| title                   | text                     | NO          | null              |
| servings                | text                     | NO          | null              |
| preparation_time        | text                     | NO          | null              |
| ingredients             | jsonb                    | NO          | '[]'::jsonb       |
| preparation             | jsonb                    | NO          | '[]'::jsonb       |
| nutritional_information | jsonb                    | YES         | null              |
| complementaries         | jsonb                    | NO          | '[]'::jsonb       |
| additional_info         | jsonb                    | NO          | '{}'::jsonb       |
| created_at              | timestamp with time zone | NO          | now()             |
| updated_at              | timestamp with time zone | NO          | now()             |
