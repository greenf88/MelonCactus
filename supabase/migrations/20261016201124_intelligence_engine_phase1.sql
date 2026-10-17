begin;

create extension if not exists pgcrypto with schema extensions;

create schema if not exists mc_intel;
comment on schema mc_intel is
  'Private MelonCactus intelligence operations. Never expose this schema through the Data API.';

revoke all on schema mc_intel from public, anon, authenticated;
grant usage on schema mc_intel to service_role;

alter default privileges for role postgres in schema mc_intel
  revoke all on tables from public, anon, authenticated;
alter default privileges for role postgres in schema mc_intel
  revoke all on sequences from public, anon, authenticated;
alter default privileges for role postgres in schema mc_intel
  revoke execute on functions from public, anon, authenticated;

create table mc_intel.dossier_sequences (
  period_start date primary key,
  last_value smallint not null,
  updated_at timestamptz not null default now(),
  constraint dossier_sequences_period_is_month_start
    check (period_start = date_trunc('month', period_start)::date),
  constraint dossier_sequences_value_range check (last_value between 1 and 999)
);

create table mc_intel.dossiers (
  id bigint generated always as identity primary key,
  dossier_number text not null unique,
  received_at timestamptz not null,
  status text not null default 'enquiry',
  decision_question text not null,
  scope jsonb not null default '{}'::jsonb,
  restricted_record_pointer text,
  retention_due_at timestamptz,
  legal_hold boolean not null default false,
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz,
  constraint dossiers_number_format check (dossier_number ~ '^[0-9]{2}(0[1-9]|1[0-2])[0-9]{3}$'),
  constraint dossiers_decision_question_not_blank check (btrim(decision_question) <> ''),
  constraint dossiers_scope_is_object check (jsonb_typeof(scope) = 'object'),
  constraint dossiers_status_valid check (
    status in (
      'enquiry', 'scoped', 'researching', 'verification', 'drafting',
      'awaiting_approval', 'delivered', 'declined', 'withdrawn', 'closed'
    )
  ),
  constraint dossiers_closed_at_consistent check (
    (status in ('closed', 'declined', 'withdrawn') and closed_at is not null)
    or (status not in ('closed', 'declined', 'withdrawn'))
  )
);

create table mc_intel.sources (
  id bigint generated always as identity primary key,
  dossier_id bigint not null references mc_intel.dossiers(id) on delete restrict,
  source_code text not null,
  title text not null,
  publisher text,
  source_type text not null,
  access_class text not null default 'public',
  original_url text,
  canonical_url text,
  archive_url text,
  restricted_storage_pointer text,
  published_at timestamptz,
  observed_at timestamptz,
  retrieved_at timestamptz not null default now(),
  content_sha256 bytea,
  capture_status text not null default 'metadata_only',
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sources_dossier_id_unique unique (dossier_id, id),
  constraint sources_code_unique unique (dossier_id, source_code),
  constraint sources_code_format check (source_code ~ '^S-[0-9]{2,6}$'),
  constraint sources_title_not_blank check (btrim(title) <> ''),
  constraint sources_type_valid check (
    source_type in (
      'official_website', 'public_record', 'patent', 'tender', 'manual', 'press_release',
      'news', 'job_posting', 'image', 'video', 'social_post', 'client_material', 'other'
    )
  ),
  constraint sources_access_class_valid check (
    access_class in ('public', 'client_supplied', 'restricted_derived')
  ),
  constraint sources_capture_status_valid check (
    capture_status in ('metadata_only', 'captured', 'archived', 'capture_failed')
  ),
  constraint sources_original_url_http check (
    original_url is null or original_url ~ '^https?://'
  ),
  constraint sources_canonical_url_http check (
    canonical_url is null or canonical_url ~ '^https?://'
  ),
  constraint sources_archive_url_http check (
    archive_url is null or archive_url ~ '^https?://'
  ),
  constraint sources_hash_is_sha256 check (
    content_sha256 is null or octet_length(content_sha256) = 32
  )
);

create table mc_intel.research_jobs (
  id bigint generated always as identity primary key,
  dossier_id bigint not null references mc_intel.dossiers(id) on delete restrict,
  job_key text not null,
  job_kind text not null,
  title text not null,
  instructions text not null,
  status text not null default 'queued',
  priority smallint not null default 50,
  approval_required boolean not null default false,
  attempt_count smallint not null default 0,
  input_scope jsonb not null default '{}'::jsonb,
  created_by text not null,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint research_jobs_dossier_id_unique unique (dossier_id, id),
  constraint research_jobs_key_unique unique (dossier_id, job_key),
  constraint research_jobs_key_not_blank check (btrim(job_key) <> ''),
  constraint research_jobs_title_not_blank check (btrim(title) <> ''),
  constraint research_jobs_instructions_not_blank check (btrim(instructions) <> ''),
  constraint research_jobs_kind_valid check (
    job_kind in (
      'scope', 'source_discovery', 'technical_research', 'corporate_research',
      'evidence_normalisation', 'red_team', 'analyst', 'report_draft', 'qa', 'human_approval'
    )
  ),
  constraint research_jobs_status_valid check (
    status in ('queued', 'running', 'completed', 'failed', 'cancelled', 'blocked_approval')
  ),
  constraint research_jobs_priority_range check (priority between 1 and 100),
  constraint research_jobs_attempt_count_nonnegative check (attempt_count >= 0),
  constraint research_jobs_input_scope_is_object check (jsonb_typeof(input_scope) = 'object')
);

create table mc_intel.research_job_dependencies (
  dossier_id bigint not null references mc_intel.dossiers(id) on delete restrict,
  job_id bigint not null,
  depends_on_job_id bigint not null,
  created_at timestamptz not null default now(),
  primary key (job_id, depends_on_job_id),
  constraint research_job_dependencies_job_same_dossier
    foreign key (dossier_id, job_id)
    references mc_intel.research_jobs(dossier_id, id) on delete cascade,
  constraint research_job_dependencies_parent_same_dossier
    foreign key (dossier_id, depends_on_job_id)
    references mc_intel.research_jobs(dossier_id, id) on delete restrict,
  constraint research_job_dependencies_no_self_reference check (job_id <> depends_on_job_id)
);

create table mc_intel.agent_runs (
  id bigint generated always as identity primary key,
  dossier_id bigint not null references mc_intel.dossiers(id) on delete restrict,
  research_job_id bigint not null,
  agent_role text not null,
  model_provider text,
  model_name text,
  prompt_version text not null,
  status text not null default 'running',
  input_sha256 bytea,
  output_sha256 bytea,
  input_pointer text,
  output_pointer text,
  input_tokens bigint,
  output_tokens bigint,
  estimated_cost numeric(12, 6),
  error_code text,
  error_summary text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint agent_runs_dossier_id_unique unique (dossier_id, id),
  constraint agent_runs_job_same_dossier
    foreign key (dossier_id, research_job_id)
    references mc_intel.research_jobs(dossier_id, id) on delete restrict,
  constraint agent_runs_role_valid check (
    agent_role in (
      'scope', 'source_discovery', 'technical_research', 'corporate_research',
      'evidence_normalisation', 'red_team', 'analyst', 'report_draft', 'qa'
    )
  ),
  constraint agent_runs_status_valid check (
    status in ('running', 'completed', 'failed', 'cancelled')
  ),
  constraint agent_runs_input_hash_is_sha256 check (
    input_sha256 is null or octet_length(input_sha256) = 32
  ),
  constraint agent_runs_output_hash_is_sha256 check (
    output_sha256 is null or octet_length(output_sha256) = 32
  ),
  constraint agent_runs_token_counts_nonnegative check (
    coalesce(input_tokens, 0) >= 0 and coalesce(output_tokens, 0) >= 0
  ),
  constraint agent_runs_cost_nonnegative check (coalesce(estimated_cost, 0) >= 0)
);

create table mc_intel.evidence (
  id bigint generated always as identity primary key,
  dossier_id bigint not null references mc_intel.dossiers(id) on delete restrict,
  source_id bigint not null,
  evidence_code text not null,
  evidence_class text not null,
  observation text not null,
  locator text,
  observed_at timestamptz,
  captured_at timestamptz not null default now(),
  content_sha256 bytea,
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint evidence_dossier_id_unique unique (dossier_id, id),
  constraint evidence_source_same_dossier
    foreign key (dossier_id, source_id)
    references mc_intel.sources(dossier_id, id) on delete restrict,
  constraint evidence_code_unique unique (dossier_id, evidence_code),
  constraint evidence_code_format check (evidence_code ~ '^E-[0-9]{2,6}$'),
  constraint evidence_class_valid check (
    evidence_class in ('observation', 'measurement', 'statement', 'document_excerpt', 'image_frame')
  ),
  constraint evidence_observation_not_blank check (btrim(observation) <> ''),
  constraint evidence_hash_is_sha256 check (
    content_sha256 is null or octet_length(content_sha256) = 32
  )
);

create table mc_intel.evidence_provenance (
  evidence_id bigint primary key,
  dossier_id bigint not null references mc_intel.dossiers(id) on delete restrict,
  source_id bigint not null,
  normalisation_run_id bigint not null,
  evidence_class text not null,
  content_sha256 bytea not null,
  schema_version text not null,
  created_at timestamptz not null default now(),
  constraint evidence_provenance_evidence_same_dossier
    foreign key (dossier_id, evidence_id)
    references mc_intel.evidence(dossier_id, id) on delete restrict,
  constraint evidence_provenance_source_same_dossier
    foreign key (dossier_id, source_id)
    references mc_intel.sources(dossier_id, id) on delete restrict,
  constraint evidence_provenance_run_same_dossier
    foreign key (dossier_id, normalisation_run_id)
    references mc_intel.agent_runs(dossier_id, id) on delete restrict,
  constraint evidence_provenance_class_valid check (
    evidence_class in ('observation', 'measurement', 'statement', 'document_excerpt', 'image_frame')
  ),
  constraint evidence_provenance_hash_is_sha256 check (octet_length(content_sha256) = 32),
  constraint evidence_provenance_schema_not_blank check (btrim(schema_version) <> ''),
  constraint evidence_provenance_content_unique unique (dossier_id, content_sha256)
);

create table mc_intel.findings (
  id bigint generated always as identity primary key,
  dossier_id bigint not null references mc_intel.dossiers(id) on delete restrict,
  finding_code text not null,
  finding_type text not null,
  statement text not null,
  rationale text not null,
  confidence text not null default 'unknown',
  material boolean not null default true,
  status text not null default 'proposed',
  contradiction_resolution text,
  information_gaps text[] not null default '{}'::text[],
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint findings_dossier_id_unique unique (dossier_id, id),
  constraint findings_code_unique unique (dossier_id, finding_code),
  constraint findings_code_format check (finding_code ~ '^F-[0-9]{2,6}$'),
  constraint findings_type_valid check (
    finding_type in ('observation', 'assessment', 'inference', 'unknown')
  ),
  constraint findings_statement_not_blank check (btrim(statement) <> ''),
  constraint findings_rationale_not_blank check (btrim(rationale) <> ''),
  constraint findings_confidence_valid check (
    confidence in ('high', 'moderate', 'low', 'unknown')
  ),
  constraint findings_status_valid check (
    status in ('proposed', 'evidence_linked', 'red_teamed', 'verified', 'rejected')
  )
);

create table mc_intel.finding_provenance (
  finding_id bigint primary key,
  dossier_id bigint not null references mc_intel.dossiers(id) on delete restrict,
  proposal_run_id bigint not null,
  schema_version text not null,
  content_sha256 bytea not null,
  created_at timestamptz not null default now(),
  constraint finding_provenance_finding_same_dossier
    foreign key (dossier_id, finding_id)
    references mc_intel.findings(dossier_id, id) on delete restrict,
  constraint finding_provenance_run_same_dossier
    foreign key (dossier_id, proposal_run_id)
    references mc_intel.agent_runs(dossier_id, id) on delete restrict,
  constraint finding_provenance_schema_not_blank check (btrim(schema_version) <> ''),
  constraint finding_provenance_hash_is_sha256 check (octet_length(content_sha256) = 32),
  constraint finding_provenance_content_unique unique (dossier_id, content_sha256)
);

create table mc_intel.finding_evidence (
  dossier_id bigint not null references mc_intel.dossiers(id) on delete restrict,
  finding_id bigint not null,
  evidence_id bigint not null,
  direction text not null,
  weight numeric(4, 3),
  linked_by text not null,
  created_at timestamptz not null default now(),
  primary key (finding_id, evidence_id),
  constraint finding_evidence_finding_same_dossier
    foreign key (dossier_id, finding_id)
    references mc_intel.findings(dossier_id, id) on delete cascade,
  constraint finding_evidence_evidence_same_dossier
    foreign key (dossier_id, evidence_id)
    references mc_intel.evidence(dossier_id, id) on delete restrict,
  constraint finding_evidence_direction_valid check (
    direction in ('supports', 'contradicts', 'context')
  ),
  constraint finding_evidence_weight_range check (
    weight is null or weight between 0 and 1
  )
);

create table mc_intel.verification_reviews (
  id bigint generated always as identity primary key,
  dossier_id bigint not null references mc_intel.dossiers(id) on delete restrict,
  finding_id bigint not null,
  review_type text not null,
  reviewer_kind text not null,
  reviewer_ref text not null,
  verdict text not null,
  confidence_before text not null,
  confidence_after text not null,
  alternative_explanations text[] not null default '{}'::text[],
  unresolved_gaps text[] not null default '{}'::text[],
  notes text,
  created_at timestamptz not null default now(),
  completed_at timestamptz not null default now(),
  constraint verification_reviews_finding_same_dossier
    foreign key (dossier_id, finding_id)
    references mc_intel.findings(dossier_id, id) on delete restrict,
  constraint verification_reviews_type_valid check (
    review_type in ('source_verification', 'red_team', 'qa')
  ),
  constraint verification_reviews_reviewer_kind_valid check (
    reviewer_kind in ('agent', 'human')
  ),
  constraint verification_reviews_verdict_valid check (
    verdict in ('pass', 'qualified', 'inconclusive', 'reject')
  ),
  constraint verification_reviews_confidence_before_valid check (
    confidence_before in ('high', 'moderate', 'low', 'unknown')
  ),
  constraint verification_reviews_confidence_after_valid check (
    confidence_after in ('high', 'moderate', 'low', 'unknown')
  )
);

create table mc_intel.report_drafts (
  id bigint generated always as identity primary key,
  dossier_id bigint not null references mc_intel.dossiers(id) on delete restrict,
  version smallint not null,
  status text not null default 'composing',
  title text not null,
  executive_summary text,
  body_markdown text not null,
  created_by text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz,
  constraint report_drafts_version_unique unique (dossier_id, version),
  constraint report_drafts_version_positive check (version > 0),
  constraint report_drafts_title_not_blank check (btrim(title) <> ''),
  constraint report_drafts_body_not_blank check (btrim(body_markdown) <> ''),
  constraint report_drafts_status_valid check (
    status in ('composing', 'red_team_required', 'review_ready', 'approved', 'archived')
  ),
  constraint report_drafts_approval_consistent check (
    (status = 'approved' and approved_at is not null) or status <> 'approved'
  )
);

create table mc_intel.approvals (
  id bigint generated always as identity primary key,
  dossier_id bigint not null references mc_intel.dossiers(id) on delete restrict,
  object_type text not null,
  object_id text not null,
  reviewer_kind text not null,
  decided_by text not null,
  decision text not null,
  rationale text not null,
  decided_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint approvals_object_type_valid check (
    object_type in ('scope', 'finding', 'report_draft')
  ),
  constraint approvals_reviewer_kind_valid check (
    reviewer_kind = 'human'
  ),
  constraint approvals_decision_valid check (
    decision in ('approved', 'rejected', 'changes_requested')
  ),
  constraint approvals_rationale_not_blank check (btrim(rationale) <> '')
);

create table mc_intel.audit_events (
  id bigint generated always as identity primary key,
  dossier_id bigint not null references mc_intel.dossiers(id) on delete restrict,
  occurred_at timestamptz not null default now(),
  actor_type text not null,
  actor_ref text not null,
  action text not null,
  object_type text not null,
  object_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  previous_hash bytea,
  event_hash bytea not null unique,
  constraint audit_events_actor_type_valid check (
    actor_type in ('human', 'agent', 'system')
  ),
  constraint audit_events_metadata_is_object check (jsonb_typeof(metadata) = 'object'),
  constraint audit_events_previous_hash_is_sha256 check (
    previous_hash is null or octet_length(previous_hash) = 32
  ),
  constraint audit_events_event_hash_is_sha256 check (octet_length(event_hash) = 32)
);

create index sources_dossier_retrieved_idx
  on mc_intel.sources (dossier_id, retrieved_at desc);
create index research_jobs_dossier_status_idx
  on mc_intel.research_jobs (dossier_id, status, priority desc, created_at);
create index research_job_dependencies_dossier_idx
  on mc_intel.research_job_dependencies (dossier_id);
create index research_job_dependencies_depends_on_idx
  on mc_intel.research_job_dependencies (depends_on_job_id);
create index agent_runs_dossier_job_idx
  on mc_intel.agent_runs (dossier_id, research_job_id, started_at desc);
create unique index agent_runs_one_running_job_idx
  on mc_intel.agent_runs (research_job_id) where status = 'running';
create index evidence_dossier_source_idx
  on mc_intel.evidence (dossier_id, source_id);
create index evidence_provenance_dossier_run_idx
  on mc_intel.evidence_provenance (dossier_id, normalisation_run_id);
create index findings_dossier_status_idx
  on mc_intel.findings (dossier_id, status, material);
create index finding_provenance_dossier_run_idx
  on mc_intel.finding_provenance (dossier_id, proposal_run_id);
create index finding_evidence_dossier_idx
  on mc_intel.finding_evidence (dossier_id);
create index finding_evidence_evidence_idx
  on mc_intel.finding_evidence (evidence_id);
create index verification_reviews_dossier_finding_idx
  on mc_intel.verification_reviews (dossier_id, finding_id, review_type);
create index report_drafts_dossier_status_idx
  on mc_intel.report_drafts (dossier_id, status, version desc);
create index approvals_dossier_object_idx
  on mc_intel.approvals (dossier_id, object_type, object_id, decided_at desc);
create index audit_events_dossier_id_idx
  on mc_intel.audit_events (dossier_id, id);

create or replace function mc_intel.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

create or replace function mc_intel.write_audit_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row jsonb;
  v_dossier_id bigint;
  v_object_id text;
  v_actor_type text;
  v_actor_ref text;
  v_occurred_at timestamptz := pg_catalog.clock_timestamp();
  v_metadata jsonb;
  v_previous_hash bytea;
  v_event_hash bytea;
begin
  v_row := case when tg_op = 'DELETE' then pg_catalog.to_jsonb(old) else pg_catalog.to_jsonb(new) end;
  v_dossier_id := case
    when tg_table_name = 'dossiers' then (v_row ->> 'id')::bigint
    else (v_row ->> 'dossier_id')::bigint
  end;
  v_object_id := case
    when tg_table_name = 'finding_evidence'
      then (v_row ->> 'finding_id') || ':' || (v_row ->> 'evidence_id')
    when tg_table_name = 'evidence_provenance'
      then v_row ->> 'evidence_id'
    when tg_table_name = 'research_job_dependencies'
      then (v_row ->> 'job_id') || ':' || (v_row ->> 'depends_on_job_id')
    else coalesce(v_row ->> 'id', v_row ->> 'dossier_number', 'unknown')
  end;
  v_actor_type := case pg_catalog.current_setting('mc_intel.actor_type', true)
    when 'human' then 'human'
    when 'agent' then 'agent'
    else 'system'
  end;
  v_actor_ref := coalesce(
    nullif(pg_catalog.current_setting('mc_intel.actor_ref', true), ''),
    session_user
  );
  v_metadata := pg_catalog.jsonb_build_object(
    'schema', tg_table_schema,
    'table', tg_table_name,
    'operation', pg_catalog.lower(tg_op)
  );

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('mc_intel.audit.' || v_dossier_id::text, 0)
  );

  select event_hash
  into v_previous_hash
  from mc_intel.audit_events
  where dossier_id = v_dossier_id
  order by id desc
  limit 1;

  v_event_hash := extensions.digest(
    coalesce(v_previous_hash, ''::bytea)
      || pg_catalog.convert_to(
        pg_catalog.concat_ws(
          '|',
          v_occurred_at::text,
          v_actor_type,
          v_actor_ref,
          pg_catalog.lower(tg_op),
          tg_table_name,
          v_object_id,
          v_metadata::text
        ),
        'UTF8'
      ),
    'sha256'
  );

  insert into mc_intel.audit_events (
    dossier_id, occurred_at, actor_type, actor_ref, action,
    object_type, object_id, metadata, previous_hash, event_hash
  ) values (
    v_dossier_id, v_occurred_at, v_actor_type, v_actor_ref, pg_catalog.lower(tg_op),
    tg_table_name, v_object_id, v_metadata, v_previous_hash, v_event_hash
  );

  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create or replace function mc_intel.register_dossier(
  p_received_at timestamptz,
  p_decision_question text,
  p_created_by text,
  p_scope jsonb default '{}'::jsonb
)
returns table (id bigint, dossier_number text)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_period_start date;
  v_sequence smallint;
  v_dossier_number text;
begin
  if p_received_at is null then
    raise exception 'received_at is required';
  end if;
  if p_decision_question is null or pg_catalog.btrim(p_decision_question) = '' then
    raise exception 'decision_question is required';
  end if;
  if p_created_by is null or pg_catalog.btrim(p_created_by) = '' then
    raise exception 'created_by is required';
  end if;
  if p_scope is null or pg_catalog.jsonb_typeof(p_scope) <> 'object' then
    raise exception 'scope must be a JSON object';
  end if;

  v_period_start := pg_catalog.date_trunc(
    'month', p_received_at at time zone 'Europe/Amsterdam'
  )::date;

  insert into mc_intel.dossier_sequences as sequence_row (period_start, last_value)
  values (v_period_start, 1)
  on conflict (period_start) do update
  set last_value = sequence_row.last_value + 1,
      updated_at = pg_catalog.now()
  where sequence_row.last_value < 999
  returning last_value into v_sequence;

  if v_sequence is null then
    raise exception 'monthly dossier sequence exhausted for %', v_period_start;
  end if;

  v_dossier_number := pg_catalog.to_char(v_period_start, 'YYMM')
    || pg_catalog.lpad(v_sequence::text, 3, '0');

  return query
  insert into mc_intel.dossiers as dossier (
    dossier_number, received_at, decision_question, scope, created_by
  ) values (
    v_dossier_number,
    p_received_at,
    pg_catalog.btrim(p_decision_question),
    p_scope,
    pg_catalog.btrim(p_created_by)
  )
  returning dossier.id, dossier.dossier_number;
end;
$$;

create or replace function mc_intel.enforce_report_gate()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_material_count bigint;
  v_blocker_count bigint;
begin
  if new.status not in ('review_ready', 'approved') then
    return new;
  end if;

  select pg_catalog.count(*)
  into v_material_count
  from mc_intel.findings
  where dossier_id = new.dossier_id and material;

  if v_material_count = 0 then
    raise exception 'report cannot advance without a material finding';
  end if;

  select pg_catalog.count(*)
  into v_blocker_count
  from mc_intel.findings as finding
  where finding.dossier_id = new.dossier_id
    and finding.material
    and (
      finding.status <> 'verified'
      or (
        exists (
          select 1
          from mc_intel.finding_provenance as provenance
          where provenance.finding_id = finding.id
        )
        and not exists (
          select 1
          from mc_intel.approvals as approval
          where approval.dossier_id = finding.dossier_id
            and approval.object_type = 'finding'
            and approval.object_id = finding.id::text
            and approval.reviewer_kind = 'human'
            and approval.decision = 'approved'
        )
      )
      or (
        finding.finding_type <> 'unknown'
        and not exists (
          select 1
          from mc_intel.finding_evidence as link
          where link.finding_id = finding.id and link.direction = 'supports'
        )
      )
      or (
        finding.finding_type not in ('observation', 'unknown')
        and not exists (
          select 1
          from mc_intel.verification_reviews as review
          where review.finding_id = finding.id
            and review.review_type = 'red_team'
            and review.reviewer_ref <> finding.created_by
            and review.verdict in ('pass', 'qualified', 'inconclusive')
        )
      )
      or exists (
        select 1
        from mc_intel.verification_reviews as review
        where review.finding_id = finding.id
          and review.review_type = 'red_team'
          and review.verdict = 'reject'
      )
      or (
        exists (
          select 1
          from mc_intel.finding_evidence as link
          where link.finding_id = finding.id and link.direction = 'contradicts'
        )
        and coalesce(pg_catalog.btrim(finding.contradiction_resolution), '') = ''
      )
      or (
        finding.confidence = 'high'
        and (
          select pg_catalog.count(distinct evidence.source_id)
          from mc_intel.finding_evidence as link
          join mc_intel.evidence as evidence on evidence.id = link.evidence_id
          where link.finding_id = finding.id and link.direction = 'supports'
        ) < 2
      )
    );

  if v_blocker_count > 0 then
    raise exception 'report has % material finding(s) blocked by evidence or verification gates', v_blocker_count;
  end if;

  if new.status = 'approved' and not exists (
    select 1
    from mc_intel.approvals as approval
    where approval.dossier_id = new.dossier_id
      and approval.object_type = 'report_draft'
      and approval.object_id = new.id::text
      and approval.reviewer_kind = 'human'
      and approval.decision = 'approved'
  ) then
    raise exception 'report approval requires a recorded human approval';
  end if;

  return new;
end;
$$;

create trigger dossiers_set_updated_at
before update on mc_intel.dossiers
for each row execute function mc_intel.set_updated_at();
create trigger sources_set_updated_at
before update on mc_intel.sources
for each row execute function mc_intel.set_updated_at();
create trigger research_jobs_set_updated_at
before update on mc_intel.research_jobs
for each row execute function mc_intel.set_updated_at();
create trigger evidence_set_updated_at
before update on mc_intel.evidence
for each row execute function mc_intel.set_updated_at();
create trigger findings_set_updated_at
before update on mc_intel.findings
for each row execute function mc_intel.set_updated_at();
create trigger report_drafts_set_updated_at
before update on mc_intel.report_drafts
for each row execute function mc_intel.set_updated_at();

create trigger report_drafts_enforce_gate
before insert or update of status on mc_intel.report_drafts
for each row execute function mc_intel.enforce_report_gate();

create trigger dossiers_audit
after insert or update or delete on mc_intel.dossiers
for each row execute function mc_intel.write_audit_event();
create trigger sources_audit
after insert or update or delete on mc_intel.sources
for each row execute function mc_intel.write_audit_event();
create trigger research_jobs_audit
after insert or update or delete on mc_intel.research_jobs
for each row execute function mc_intel.write_audit_event();
create trigger research_job_dependencies_audit
after insert or update or delete on mc_intel.research_job_dependencies
for each row execute function mc_intel.write_audit_event();
create trigger agent_runs_audit
after insert or update or delete on mc_intel.agent_runs
for each row execute function mc_intel.write_audit_event();
create trigger evidence_audit
after insert or update or delete on mc_intel.evidence
for each row execute function mc_intel.write_audit_event();
create trigger evidence_provenance_audit
after insert or update or delete on mc_intel.evidence_provenance
for each row execute function mc_intel.write_audit_event();
create trigger findings_audit
after insert or update or delete on mc_intel.findings
for each row execute function mc_intel.write_audit_event();
create trigger finding_provenance_audit
after insert or update or delete on mc_intel.finding_provenance
for each row execute function mc_intel.write_audit_event();
create trigger finding_evidence_audit
after insert or update or delete on mc_intel.finding_evidence
for each row execute function mc_intel.write_audit_event();
create trigger verification_reviews_audit
after insert or update or delete on mc_intel.verification_reviews
for each row execute function mc_intel.write_audit_event();
create trigger report_drafts_audit
after insert or update or delete on mc_intel.report_drafts
for each row execute function mc_intel.write_audit_event();
create trigger approvals_audit
after insert or update or delete on mc_intel.approvals
for each row execute function mc_intel.write_audit_event();

alter table mc_intel.dossier_sequences enable row level security;
alter table mc_intel.dossier_sequences force row level security;
alter table mc_intel.dossiers enable row level security;
alter table mc_intel.dossiers force row level security;
alter table mc_intel.sources enable row level security;
alter table mc_intel.sources force row level security;
alter table mc_intel.research_jobs enable row level security;
alter table mc_intel.research_jobs force row level security;
alter table mc_intel.research_job_dependencies enable row level security;
alter table mc_intel.research_job_dependencies force row level security;
alter table mc_intel.agent_runs enable row level security;
alter table mc_intel.agent_runs force row level security;
alter table mc_intel.evidence enable row level security;
alter table mc_intel.evidence force row level security;
alter table mc_intel.evidence_provenance enable row level security;
alter table mc_intel.evidence_provenance force row level security;
alter table mc_intel.findings enable row level security;
alter table mc_intel.findings force row level security;
alter table mc_intel.finding_provenance enable row level security;
alter table mc_intel.finding_provenance force row level security;
alter table mc_intel.finding_evidence enable row level security;
alter table mc_intel.finding_evidence force row level security;
alter table mc_intel.verification_reviews enable row level security;
alter table mc_intel.verification_reviews force row level security;
alter table mc_intel.report_drafts enable row level security;
alter table mc_intel.report_drafts force row level security;
alter table mc_intel.approvals enable row level security;
alter table mc_intel.approvals force row level security;
alter table mc_intel.audit_events enable row level security;
alter table mc_intel.audit_events force row level security;

revoke all on all tables in schema mc_intel from public, anon, authenticated;
revoke all on all sequences in schema mc_intel from public, anon, authenticated;
revoke execute on all functions in schema mc_intel from public, anon, authenticated;

grant select, insert, update on table
  mc_intel.dossier_sequences,
  mc_intel.dossiers,
  mc_intel.sources,
  mc_intel.research_jobs,
  mc_intel.research_job_dependencies,
  mc_intel.agent_runs,
  mc_intel.evidence,
  mc_intel.evidence_provenance,
  mc_intel.findings,
  mc_intel.finding_provenance,
  mc_intel.finding_evidence,
  mc_intel.verification_reviews,
  mc_intel.report_drafts,
  mc_intel.approvals
to service_role;
grant select on table mc_intel.audit_events to service_role;
grant usage, select on all sequences in schema mc_intel to service_role;
grant execute on function mc_intel.register_dossier(timestamptz, text, text, jsonb) to service_role;

comment on table mc_intel.audit_events is
  'Append-only metadata audit chain. Never store client names, email, source content, prompts or report bodies in metadata.';
comment on table mc_intel.agent_runs is
  'Run metadata and restricted pointers only; raw prompts and outputs do not belong in the audit log.';
comment on function mc_intel.register_dossier(timestamptz, text, text, jsonb) is
  'Atomically allocates the next YYMMNNN dossier number in Europe/Amsterdam time.';

commit;
