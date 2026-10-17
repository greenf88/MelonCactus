export const LOCAL_SCHEMA_VERSION = 2;

export const localSchemaSql = `
pragma foreign_keys = on;
pragma journal_mode = wal;
pragma synchronous = full;
pragma busy_timeout = 5000;
pragma trusted_schema = off;

create table if not exists local_meta (
  key text primary key,
  value text not null
) strict;

create table if not exists dossier_sequences (
  period_key text primary key check (length(period_key) = 4),
  last_value integer not null check (last_value between 1 and 999),
  updated_at text not null
) strict;

create table if not exists dossiers (
  id text primary key,
  dossier_number text not null unique,
  received_at text not null,
  decision_question text not null check (length(trim(decision_question)) > 0),
  scope_json text not null check (json_valid(scope_json)),
  status text not null default 'registered'
    check (status in ('registered', 'scoped', 'researching', 'reviewing', 'drafted', 'closed')),
  created_by text not null check (length(trim(created_by)) > 0),
  created_at text not null,
  updated_at text not null,
  version integer not null default 1 check (version > 0)
) strict;

create table if not exists sources (
  id text primary key,
  dossier_id text not null references dossiers(id) on delete restrict,
  code text not null,
  title text not null check (length(trim(title)) > 0),
  canonical_url text,
  publisher text,
  source_type text not null check (length(trim(source_type)) > 0),
  published_at text,
  retrieved_at text not null,
  sha256 text check (sha256 is null or length(sha256) = 64),
  created_at text not null,
  unique (dossier_id, code),
  unique (dossier_id, id)
) strict;

create table if not exists research_jobs (
  id text primary key,
  dossier_id text not null references dossiers(id) on delete restrict,
  job_key text not null,
  role text not null,
  title text not null,
  execution text not null check (execution in ('agent', 'human')),
  status text not null default 'pending'
    check (status in ('pending', 'ready', 'running', 'blocked', 'completed', 'waiting_for_approval')),
  approval_required integer not null default 0 check (approval_required in (0, 1)),
  created_at text not null,
  updated_at text not null,
  unique (dossier_id, job_key),
  unique (dossier_id, id)
) strict;

create table if not exists research_job_dependencies (
  dossier_id text not null references dossiers(id) on delete restrict,
  job_id text not null,
  depends_on_job_id text not null,
  primary key (job_id, depends_on_job_id),
  foreign key (dossier_id, job_id) references research_jobs(dossier_id, id) on delete restrict,
  foreign key (dossier_id, depends_on_job_id) references research_jobs(dossier_id, id) on delete restrict,
  check (job_id <> depends_on_job_id)
) strict;

create table if not exists agent_runs (
  id text primary key,
  dossier_id text not null references dossiers(id) on delete restrict,
  research_job_id text not null,
  agent_role text not null,
  model_provider text,
  model_name text,
  status text not null check (status in ('started', 'completed', 'failed', 'cancelled')),
  input_hash text check (input_hash is null or length(input_hash) = 64),
  output_hash text check (output_hash is null or length(output_hash) = 64),
  input_pointer text,
  output_pointer text,
  input_tokens integer check (input_tokens is null or input_tokens >= 0),
  output_tokens integer check (output_tokens is null or output_tokens >= 0),
  estimated_cost_micros integer check (estimated_cost_micros is null or estimated_cost_micros >= 0),
  started_at text not null,
  completed_at text,
  foreign key (dossier_id, research_job_id)
    references research_jobs(dossier_id, id) on delete restrict,
  unique (dossier_id, id)
) strict;

create table if not exists evidence (
  id text primary key,
  dossier_id text not null references dossiers(id) on delete restrict,
  source_id text not null,
  code text not null,
  observation text not null check (length(trim(observation)) > 0),
  locator text,
  observed_at text,
  created_at text not null,
  foreign key (dossier_id, source_id) references sources(dossier_id, id) on delete restrict,
  unique (dossier_id, code),
  unique (dossier_id, id)
) strict;

create table if not exists findings (
  id text primary key,
  dossier_id text not null references dossiers(id) on delete restrict,
  code text not null,
  statement text not null check (length(trim(statement)) > 0),
  finding_type text not null
    check (finding_type in ('observation', 'assessment', 'inference', 'unknown')),
  confidence text not null check (confidence in ('high', 'moderate', 'low', 'unknown')),
  rationale text not null check (length(trim(rationale)) > 0),
  material integer not null check (material in (0, 1)),
  created_by text not null,
  status text not null
    check (status in ('proposed', 'evidence_linked', 'red_teamed', 'verified', 'rejected')),
  contradiction_resolution text,
  information_gaps_json text not null default '[]' check (json_valid(information_gaps_json)),
  created_at text not null,
  updated_at text not null,
  unique (dossier_id, code),
  unique (dossier_id, id)
) strict;

create table if not exists finding_evidence (
  dossier_id text not null references dossiers(id) on delete restrict,
  finding_id text not null,
  evidence_id text not null,
  direction text not null check (direction in ('supports', 'contradicts', 'context')),
  primary key (finding_id, evidence_id),
  foreign key (dossier_id, finding_id) references findings(dossier_id, id) on delete restrict,
  foreign key (dossier_id, evidence_id) references evidence(dossier_id, id) on delete restrict
) strict;

create table if not exists verification_reviews (
  id text primary key,
  dossier_id text not null references dossiers(id) on delete restrict,
  finding_id text not null,
  review_type text not null check (review_type in ('source_verification', 'red_team', 'qa')),
  reviewer_kind text not null check (reviewer_kind in ('agent', 'human')),
  reviewer_ref text not null,
  verdict text not null check (verdict in ('pass', 'qualified', 'inconclusive', 'reject')),
  confidence_before text not null check (confidence_before in ('high', 'moderate', 'low', 'unknown')),
  confidence_after text not null check (confidence_after in ('high', 'moderate', 'low', 'unknown')),
  alternative_explanations_json text not null check (json_valid(alternative_explanations_json)),
  unresolved_gaps_json text not null check (json_valid(unresolved_gaps_json)),
  notes text,
  completed_at text not null,
  created_at text not null,
  foreign key (dossier_id, finding_id) references findings(dossier_id, id) on delete restrict,
  unique (dossier_id, id)
) strict;

create table if not exists report_drafts (
  id text primary key,
  dossier_id text not null references dossiers(id) on delete restrict,
  version integer not null check (version > 0),
  status text not null
    check (status in ('composing', 'red_team_required', 'review_ready', 'approved', 'archived')),
  title text not null check (length(trim(title)) > 0),
  body_markdown text not null check (length(trim(body_markdown)) > 0),
  created_by text not null,
  created_at text not null,
  updated_at text not null,
  approved_at text,
  unique (dossier_id, version),
  unique (dossier_id, id),
  check ((status = 'approved' and approved_at is not null) or status <> 'approved')
) strict;

create table if not exists approvals (
  id text primary key,
  dossier_id text not null references dossiers(id) on delete restrict,
  object_type text not null check (object_type in ('scope', 'finding', 'report_draft')),
  object_id text not null,
  reviewer_kind text not null check (reviewer_kind = 'human'),
  decided_by text not null,
  decision text not null check (decision in ('approved', 'rejected', 'changes_requested')),
  rationale text not null check (length(trim(rationale)) > 0),
  decided_at text not null,
  created_at text not null,
  unique (dossier_id, id)
) strict;

create table if not exists retention_items (
  id text primary key,
  dossier_id text not null references dossiers(id) on delete restrict,
  category text not null check (category in (
    'enquiry_not_converted',
    'non_fiscal_correspondence',
    'research_working_files',
    'final_report',
    'fiscal_record',
    'legal_claim'
  )),
  trigger_at text not null,
  deadline_at text not null,
  storage_locations_json text not null check (json_valid(storage_locations_json)),
  status text not null check (status in ('active', 'held', 'deletion_proposed')),
  hold_reason text,
  hold_review_at text,
  created_by text not null,
  created_at text not null,
  updated_at text not null,
  unique (dossier_id, category),
  unique (dossier_id, id),
  check (
    (status = 'held' and hold_reason is not null and hold_review_at is not null)
    or (status <> 'held' and hold_reason is null and hold_review_at is null)
  )
) strict;

create table if not exists deletion_requests (
  id text primary key,
  dossier_id text not null references dossiers(id) on delete restrict,
  status text not null check (status in ('proposed', 'approved', 'executed', 'rejected')),
  categories_json text not null check (json_valid(categories_json)),
  reviewed_at text not null,
  requested_by text not null,
  requested_at text not null,
  rationale text not null check (length(trim(rationale)) > 0),
  decided_by text,
  decided_at text,
  decision_rationale text,
  executed_by text,
  executed_at text,
  created_at text not null,
  updated_at text not null,
  unique (dossier_id, id),
  check (decided_by is null or lower(decided_by) <> lower(requested_by)),
  check (
    (status = 'proposed' and decided_by is null and decided_at is null)
    or (status in ('approved', 'executed', 'rejected') and decided_by is not null and decided_at is not null)
  ),
  check (
    (status = 'executed' and executed_by is not null and executed_at is not null)
    or (status <> 'executed' and executed_by is null and executed_at is null)
  )
) strict;

create table if not exists deletion_register (
  id text primary key,
  dossier_number text not null,
  categories_json text not null check (json_valid(categories_json)),
  action text not null check (action in ('deleted', 'anonymised')),
  locations_json text not null check (json_valid(locations_json)),
  deadline_at text not null,
  reviewed_at text not null,
  approved_by text not null,
  executed_by text not null,
  completed_at text not null,
  previous_hash text check (previous_hash is null or length(previous_hash) = 64),
  entry_hash text not null unique check (length(entry_hash) = 64)
) strict;

create table if not exists audit_events (
  sequence integer primary key autoincrement,
  dossier_id text not null references dossiers(id) on delete restrict,
  occurred_at text not null,
  actor_type text not null check (actor_type in ('human', 'agent', 'system')),
  actor_ref text not null,
  action text not null,
  object_type text not null,
  object_id text not null,
  metadata_json text not null check (json_valid(metadata_json)),
  previous_hash text check (previous_hash is null or length(previous_hash) = 64),
  event_hash text not null unique check (length(event_hash) = 64)
) strict;

create trigger if not exists audit_events_no_update
before update on audit_events
begin
  select raise(abort, 'audit events are append-only');
end;

create trigger if not exists audit_events_no_delete
before delete on audit_events
begin
  select raise(abort, 'audit events are append-only');
end;

create index if not exists sources_dossier_retrieved_idx
  on sources (dossier_id, retrieved_at desc);
create index if not exists jobs_dossier_status_idx
  on research_jobs (dossier_id, status, created_at);
create index if not exists agent_runs_job_status_idx
  on agent_runs (research_job_id, status, completed_at desc);
create unique index if not exists agent_runs_one_started_job_idx
  on agent_runs (research_job_id) where status = 'started';
create index if not exists evidence_dossier_source_idx
  on evidence (dossier_id, source_id);
create index if not exists findings_dossier_status_idx
  on findings (dossier_id, status, material);
create index if not exists reviews_dossier_finding_idx
  on verification_reviews (dossier_id, finding_id, review_type);
create index if not exists drafts_dossier_status_idx
  on report_drafts (dossier_id, status, version desc);
create index if not exists approvals_dossier_object_idx
  on approvals (dossier_id, object_type, object_id, decided_at desc);
create index if not exists retention_items_dossier_deadline_idx
  on retention_items (dossier_id, status, deadline_at);
create index if not exists deletion_requests_dossier_status_idx
  on deletion_requests (dossier_id, status, requested_at desc);
create index if not exists audit_events_dossier_sequence_idx
  on audit_events (dossier_id, sequence);
`;
