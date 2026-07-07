/**
 * Represents a single row from the Content Calendar Excel file.
 * Stored as JSON in the Setting model (key: 'content-calendar-data').
 */
export interface CalendarTopic {
  /** Internal stable ID: "topic-{rowIndex}" */
  _id: string;
  month:             string;
  week:              string;
  priority:          string;   // High | Medium | Low
  category:          string;
  cluster:           string;
  topic:             string;
  blogTitle:         string;
  slug:              string;
  primaryKeyword:    string;
  secondaryKeywords: string;
  searchIntent:      string;
  country:           string;
  difficulty:        string;   // Easy | Medium | Hard
  wordCount:         number;
  tags:              string;
  notes:             string;
  status:            string;   // Pending | In Progress | Generated | Published | Skipped
}

export interface CalendarMeta {
  fileName:    string;
  uploadedAt:  string;
  count:       number;
}

/** Computed stats derived from CalendarTopic[] */
export interface CalendarStats {
  total:              number;
  pending:            number;
  inProgress:         number;
  generated:          number;
  published:          number;
  skipped:            number;
  remainingThisWeek:  number;
  remainingThisMonth: number;
}

/** Derives CalendarStats from a list of topics */
export function computeStats(topics: CalendarTopic[]): CalendarStats {
  const now      = new Date();
  const month    = now.toLocaleString("en-US", { month: "long" });   // "July"
  const monthNum = String(now.getMonth() + 1);                       // "7"
  const weekNum  = String(Math.ceil(now.getDate() / 7));             // "1"–"5"

  const isCurrentMonth = (t: CalendarTopic) =>
    t.month?.toLowerCase() === month.toLowerCase() ||
    t.month === monthNum;

  const isCurrentWeek = (t: CalendarTopic) =>
    isCurrentMonth(t) && (t.week === weekNum || t.week === `Week ${weekNum}` || t.week === `W${weekNum}`);

  const remaining = (t: CalendarTopic) =>
    !["generated", "published", "skipped"].includes((t.status ?? "").toLowerCase());

  return {
    total:              topics.length,
    pending:            topics.filter(t => (t.status ?? "").toLowerCase() === "pending" || t.status === "").length,
    inProgress:         topics.filter(t => (t.status ?? "").toLowerCase() === "in progress").length,
    generated:          topics.filter(t => (t.status ?? "").toLowerCase() === "generated").length,
    published:          topics.filter(t => (t.status ?? "").toLowerCase() === "published").length,
    skipped:            topics.filter(t => (t.status ?? "").toLowerCase() === "skipped").length,
    remainingThisWeek:  topics.filter(t => isCurrentWeek(t) && remaining(t)).length,
    remainingThisMonth: topics.filter(t => isCurrentMonth(t) && remaining(t)).length,
  };
}
