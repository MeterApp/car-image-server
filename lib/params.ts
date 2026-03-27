const VALID_VIEWS = ["side", "front"] as const;

export interface CarImageParams {
  view: string;
  brand: string;
  model: string;
  year: string;
  color: string | null;
  width: number | null;
  height: number | null;
}

export function parseCarImageParams(
  searchParams: URLSearchParams
): CarImageParams {
  const view = searchParams.get("view");
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  const year = searchParams.get("year");

  if (!view) throw new ParamError("Missing required parameter: view");
  if (!brand) throw new ParamError("Missing required parameter: brand");
  if (!model) throw new ParamError("Missing required parameter: model");
  if (!year) throw new ParamError("Missing required parameter: year");

  const normalizedView = view.toLowerCase().trim();
  if (!VALID_VIEWS.includes(normalizedView as (typeof VALID_VIEWS)[number])) {
    throw new ParamError(`Invalid view: "${view}". Must be one of: ${VALID_VIEWS.join(", ")}`);
  }

  const yearNum = parseInt(year, 10);
  const maxYear = new Date().getFullYear() + 1;
  if (isNaN(yearNum) || yearNum < 1990 || yearNum > maxYear) {
    throw new ParamError(`Invalid year: "${year}". Must be between 1990 and ${maxYear}`);
  }

  const color = searchParams.get("color");

  const w = searchParams.get("w");
  const h = searchParams.get("h");
  let width: number | null = null;
  let height: number | null = null;

  if (w) {
    width = parseInt(w, 10);
    if (isNaN(width) || width < 1 || width > 1024) {
      throw new ParamError(`Invalid w: "${w}". Must be between 1 and 1024`);
    }
  }
  if (h) {
    height = parseInt(h, 10);
    if (isNaN(height) || height < 1 || height > 1024) {
      throw new ParamError(`Invalid h: "${h}". Must be between 1 and 1024`);
    }
  }

  return {
    view: normalizedView,
    brand: brand.toLowerCase().trim(),
    model: model.toLowerCase().trim(),
    color: color?.toLowerCase().trim() ?? "silver",
    year: year.trim(),
    width,
    height,
  };
}

export class ParamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParamError";
  }
}
