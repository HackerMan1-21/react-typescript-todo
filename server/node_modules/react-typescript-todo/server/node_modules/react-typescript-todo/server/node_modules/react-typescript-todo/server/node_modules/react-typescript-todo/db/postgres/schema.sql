-- PostgreSQL schema for GTA Online Vehicles guide
-- Requires: pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- manufacturers
CREATE TABLE manufacturers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- vehicle types (car, bike, aircraft, boat...)
CREATE TABLE vehicle_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type_key text NOT NULL UNIQUE,
  type_label text NOT NULL,
  notes text
);

-- vehicle classes (supercar, sports, muscle...)
CREATE TABLE vehicle_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_key text NOT NULL UNIQUE,
  class_label text NOT NULL,
  vehicle_type_key text NOT NULL,
  notes text
);

-- dlcs
CREATE TABLE dlcs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dlc_key text NOT NULL UNIQUE,
  dlc_name text NOT NULL,
  release_date date,
  game_build text,
  notes text
);

-- vehicles master
CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  english_name text NOT NULL,
  japanese_name text,
  internal_name text,
  manufacturer_id uuid REFERENCES manufacturers(id) ON DELETE SET NULL,
  vehicle_type_key text,
  vehicle_class_key text,
  vehicle_subclass text,
  seat_capacity integer,
  drivetrain text,
  engine_position text,
  is_hsw boolean DEFAULT false,
  is_bennys boolean DEFAULT false,
  is_weaponized boolean DEFAULT false,
  is_armored boolean DEFAULT false,
  is_electric boolean DEFAULT false,
  is_convertible boolean DEFAULT false,
  purchase_price bigint,
  trade_price bigint,
  currency text DEFAULT 'USD',
  purchase_site text,
  storage_location text,
  is_limited_stock boolean DEFAULT false,
  is_removed_from_store boolean DEFAULT false,
  game_model_hash text,
  handling_profile_id uuid,
  release_dlc text,
  release_date date,
  game_build_added text,
  notes text,
  default_color_set_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_vehicles_manufacturer ON vehicles(manufacturer_id);
CREATE INDEX idx_vehicles_game_model_hash ON vehicles(game_model_hash);
CREATE INDEX idx_vehicles_is_hsw ON vehicles(is_hsw);
CREATE INDEX idx_vehicles_vehicle_class_key ON vehicles(vehicle_class_key);

-- vehicle_dlcs (many-to-many)
CREATE TABLE vehicle_dlcs (
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  dlc_id uuid REFERENCES dlcs(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  notes text,
  PRIMARY KEY(vehicle_id, dlc_id)
);

-- images
CREATE TABLE vehicle_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  url text NOT NULL,
  image_type text NOT NULL,
  display_order integer DEFAULT 0,
  caption text,
  internal_image_id text,
  created_at timestamptz DEFAULT now()
);

-- color palettes and sets
CREATE TABLE color_palettes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  source text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE color_palette_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  palette_id uuid REFERENCES color_palettes(id) ON DELETE CASCADE,
  color_internal_id text,
  hex_code text,
  label text,
  display_order integer DEFAULT 0
);

CREATE TABLE vehicle_color_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  name text,
  is_default boolean DEFAULT false
);

CREATE TABLE vehicle_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  color_set_id uuid REFERENCES vehicle_color_sets(id) ON DELETE CASCADE,
  color_slot text NOT NULL,
  color_name text,
  color_hex text,
  color_internal_id text,
  finish_type text,
  display_order integer DEFAULT 0
);

-- Mod types and custom items
CREATE TABLE mod_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  modtype_number integer UNIQUE,
  name text,
  description text
);

CREATE TABLE custom_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mod_type_id uuid REFERENCES mod_types(id) ON DELETE SET NULL,
  mod_key text UNIQUE,
  ui_label text,
  applies_to_type text,
  choices_json jsonb,
  display_order integer DEFAULT 0,
  is_locked_by_default boolean DEFAULT false,
  notes text
);

CREATE TABLE vehicle_mod_compat (
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  mod_type_id uuid REFERENCES mod_types(id) ON DELETE CASCADE,
  allowed boolean DEFAULT true,
  notes text,
  PRIMARY KEY(vehicle_id, mod_type_id)
);

CREATE TABLE vehicle_mod_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  mod_type_id uuid REFERENCES mod_types(id) ON DELETE CASCADE,
  price bigint,
  currency text DEFAULT 'USD',
  effective_from timestamptz DEFAULT now(),
  notes text
);

-- vehicle custom values (per-vehicle instance of custom_items)
CREATE TABLE vehicle_custom_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  custom_item_id uuid REFERENCES custom_items(id) ON DELETE CASCADE,
  value_text text,
  value_hex text,
  value_reference_id uuid,
  is_locked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- rare variants and their locked properties
CREATE TABLE rare_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  variant_key text,
  variant_name text,
  spawn_area text,
  spawn_weight numeric,
  spawn_condition_json jsonb,
  valid_from timestamptz,
  valid_to timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE rare_variant_colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rare_variant_id uuid REFERENCES rare_variants(id) ON DELETE CASCADE,
  color_slot text,
  color_id uuid REFERENCES vehicle_colors(id) ON DELETE SET NULL,
  color_hex text,
  is_locked boolean DEFAULT true
);

CREATE TABLE rare_variant_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rare_variant_id uuid REFERENCES rare_variants(id) ON DELETE CASCADE,
  image_id uuid REFERENCES vehicle_images(id) ON DELETE SET NULL,
  is_locked boolean DEFAULT true
);

-- performance measurements: allow multiple rows per vehicle with variant context
CREATE TABLE performance_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  variant text DEFAULT 'stock', -- stock, hsw, bennys, tuned, etc.
  top_speed_kmh numeric,
  acceleration_stat numeric,
  braking_stat numeric,
  traction_stat numeric,
  lap_time_ms integer,
  measured_at timestamptz DEFAULT now(),
  measured_by text,
  notes text
);

CREATE INDEX idx_perf_vehicle_variant ON performance_measurements(vehicle_id, variant);

-- price history
CREATE TABLE price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  price bigint,
  price_type text DEFAULT 'base', -- base, trade, sale, discount
  effective_date date,
  valid_until date,
  source_site text,
  note text
);

-- rankings cache (materialized view is recommended for heavy aggregations)
CREATE TABLE rankings_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  ranking_type text,
  rank_position integer,
  value numeric,
  generated_at timestamptz DEFAULT now()
);

-- handling profiles
CREATE TABLE handling_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE CASCADE,
  handling_json jsonb,
  source text,
  created_at timestamptz DEFAULT now()
);

-- manufactured_models lookup
CREATE TABLE manufactured_models (
  game_model_hash text PRIMARY KEY,
  model_name text,
  notes text
);

-- users and audit
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  display_name text,
  role text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  action text,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

-- Example materialized view suggestion for fastest HSW ranking
-- CREATE MATERIALIZED VIEW mv_fastest_hsw AS
-- SELECT p.vehicle_id, MIN(p.top_speed_kmh) AS top_speed_kmh
-- FROM performance_measurements p
-- WHERE p.variant = 'hsw' AND p.top_speed_kmh IS NOT NULL
-- GROUP BY p.vehicle_id
-- ORDER BY top_speed_kmh DESC;

-- Recommended indexes for search & filters
CREATE INDEX idx_vehicles_slug ON vehicles(slug);
CREATE INDEX idx_vehicles_release_date ON vehicles(release_date);
CREATE INDEX idx_price_history_vehicle ON price_history(vehicle_id, effective_date);

-- Trigger example to keep updated_at fresh
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- apply trigger to vehicles
CREATE TRIGGER vehicles_set_updated_at
BEFORE UPDATE ON vehicles
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_updated_at();
