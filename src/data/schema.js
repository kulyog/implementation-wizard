// /src/data/schema.js
// Ajv JSON schema for validating import backup files (B-01, F-18).
// Must match the export shape from useStorage.exportData().

export const BACKUP_SCHEMA = {
  type: 'object',
  required: ['export_format', 'schema_version', 'projects'],
  additionalProperties: true,
  properties: {
    export_format: {
      type: 'string',
      const: 'implementation-wizard-backup',
    },
    schema_version: {
      type: 'integer',
      minimum: 1,
    },
    exported_at: {
      type: ['string', 'null'],
    },
    projects: {
      type: 'array',
      items: { $ref: '#/$defs/project' },
    },
  },
  $defs: {
    project: {
      type: 'object',
      required: ['project_id', 'project_name', 'status', 'steps', 'doc_registry'],
      additionalProperties: true,
      properties: {
        project_id:          { type: 'string', minLength: 1 },
        project_name:        { type: 'string', minLength: 1, maxLength: 100 },
        project_description: { type: 'string' },
        created_at:          { type: ['string', 'null'] },
        updated_at:          { type: ['string', 'null'] },
        status: {
          type: 'string',
          enum: ['active', 'complete', 'archived'],
        },
        steps: {
          type: 'array',
          minItems: 25,
          maxItems: 25,
          items: { $ref: '#/$defs/stepRecord' },
        },
        doc_registry: {
          type: 'array',
          items: { $ref: '#/$defs/docRegistryRecord' },
        },
        change_log: {
          type: 'array',
          items: { $ref: '#/$defs/changeLogEntry' },
        },
      },
    },
    stepRecord: {
      type: 'object',
      required: ['step_number', 'status'],
      additionalProperties: true,
      properties: {
        step_number: { type: 'integer', minimum: 0, maximum: 24 },
        status: {
          type: 'string',
          enum: ['pending', 'in_progress', 'complete', 'blocked'],
        },
        blocked_reason:        { type: 'string' },
        notes:                 { type: 'string' },
        started_at:            { type: ['string', 'null'] },
        completed_at:          { type: ['string', 'null'] },
        time_in_step_seconds:  { type: 'integer', minimum: 0 },
      },
    },
    docRegistryRecord: {
      type: 'object',
      required: ['file_name', 'linked_step', 'status'],
      additionalProperties: true,
      properties: {
        file_name:   { type: 'string', minLength: 1 },
        linked_step: { type: 'integer', minimum: 1 },
        status: {
          type: 'string',
          enum: ['pending', 'created', 'noted'],
        },
        user_note: { type: 'string' },
      },
    },
    changeLogEntry: {
      type: 'object',
      required: ['id', 'date', 'type', 'description', 'status'],
      additionalProperties: true,
      properties: {
        id:                { type: 'string' },
        date:              { type: 'string' },
        type:              { type: 'string', enum: ['A', 'B', 'C', 'D'] },
        description:       { type: 'string' },
        version_target:    { type: 'string' },
        personas_to_rerun: { type: 'string' },
        status:            { type: 'string', enum: ['Open', 'In Progress', 'Closed'] },
      },
    },
  },
}
