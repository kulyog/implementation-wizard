// /src/utils/migration.js
// Upgrades stored localStorage data to the current schema version.
// Called by useStorage on mount whenever stored schema_version < CURRENT_SCHEMA_VERSION.
//
// Migration pattern: each version step is a pure function that takes the old
// data object and returns a new object in the upgraded shape.

export const CURRENT_SCHEMA_VERSION = 1

/**
 * Migrate data from any previous schema version to the current version.
 * @param {object} data - Parsed localStorage root object (may have old schema_version).
 * @returns {object} - Data object with schema_version === CURRENT_SCHEMA_VERSION.
 */
export function migrate(data) {
  let current = { ...data }

  // Future migrations go here as:
  //   if (current.schema_version < 2) { current = migrateV1toV2(current) }
  //   if (current.schema_version < 3) { current = migrateV2toV3(current) }

  // Ensure schema_version is stamped even if it was missing
  current.schema_version = CURRENT_SCHEMA_VERSION

  return current
}

/**
 * Returns true if the stored schema_version requires migration.
 * @param {number|undefined} storedVersion
 * @returns {boolean}
 */
export function needsMigration(storedVersion) {
  return typeof storedVersion !== 'number' || storedVersion < CURRENT_SCHEMA_VERSION
}
