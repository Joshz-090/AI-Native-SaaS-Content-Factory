-- Enable Row Level Security (RLS) on all tenant-owned tables
ALTER TABLE IF EXISTS "content_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "generated_text" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "generated_images" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "schedules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "publication_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "users" ENABLE ROW LEVEL SECURITY;

-- Helper to safely drop policies if re-running
DROP POLICY IF EXISTS tenant_isolation_content_requests ON "content_requests";
DROP POLICY IF EXISTS tenant_isolation_generated_text ON "generated_text";
DROP POLICY IF EXISTS tenant_isolation_generated_images ON "generated_images";
DROP POLICY IF EXISTS tenant_isolation_schedules ON "schedules";
DROP POLICY IF EXISTS tenant_isolation_publication_logs ON "publication_logs";
DROP POLICY IF EXISTS tenant_isolation_users ON "users";

-- Enforce tenant isolation via app.current_tenant_id session variable
CREATE POLICY tenant_isolation_content_requests ON "content_requests"
  AS RESTRICTIVE
  USING ("organizationId" = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK ("organizationId" = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_generated_text ON "generated_text"
  AS RESTRICTIVE
  USING ("organizationId" = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK ("organizationId" = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_generated_images ON "generated_images"
  AS RESTRICTIVE
  USING ("organizationId" = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK ("organizationId" = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_schedules ON "schedules"
  AS RESTRICTIVE
  USING ("organizationId" = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK ("organizationId" = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_publication_logs ON "publication_logs"
  AS RESTRICTIVE
  USING ("organizationId" = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK ("organizationId" = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_users ON "users"
  AS RESTRICTIVE
  USING ("organizationId" = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK ("organizationId" = NULLIF(current_setting('app.current_tenant_id', true), ''));
