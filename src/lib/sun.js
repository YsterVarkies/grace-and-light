// Sun times for Dullstroom, worked out in the browser (no network, no key).
// The maths is the standard low-precision solar position series; it is good
// to about a minute, which is all a photographer's "golden hour" needs.

const RAD = Math.PI / 180;
const DAY = 86400000;
const J1970 = 2440588;
const J2000 = 2451545;
const TZ = 'Africa/Johannesburg';

export const DULLSTROOM = { lat: -25.4167, lng: 30.1 };

// "Golden hour" here: the sun between the horizon and 6 degrees above it.
const GOLD_ALTITUDE = 6;
const HORIZON = -0.833;

export function sunTimes(isoDate, { lat, lng } = DULLSTROOM) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const noonLocal = Date.UTC(y, m - 1, d, 10); // 12:00 in South Africa (UTC+2)
  const lw = -lng * RAD;
  const phi = lat * RAD;
  const days = noonLocal / DAY - 0.5 + J1970 - J2000;
  const n = Math.round(days - 0.0009 - lw / (2 * Math.PI));
  const approx = hourAngle => 0.0009 + (hourAngle + lw) / (2 * Math.PI) + n;

  const ds = approx(0);
  const M = RAD * (357.5291 + 0.98560028 * ds);
  const C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  const L = M + C + RAD * 102.9372 + Math.PI;
  const dec = Math.asin(Math.sin(L) * Math.sin(RAD * 23.4397));
  const transit = s => J2000 + s + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
  const noon = transit(ds);

  const at = altitude => {
    const w = Math.acos(
      (Math.sin(altitude * RAD) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec))
    );
    const set = transit(approx(w));
    return [noon - (set - noon), set];
  };
  const toDate = j => new Date((j + 0.5 - J1970) * DAY);

  const [rise, set] = at(HORIZON);
  const [goldEndsAm, goldStartsPm] = at(GOLD_ALTITUDE);
  return {
    sunrise: toDate(rise),
    morningEnd: toDate(goldEndsAm),
    eveningStart: toDate(goldStartsPm),
    sunset: toDate(set)
  };
}

const clockFormat = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: TZ
});
export const clock = date => clockFormat.format(date);

// Today's date in Dullstroom, as YYYY-MM-DD, whatever the visitor's own clock says.
export const todayInDullstroom = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);

export const addDays = (isoDate, count) => {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + count)).toISOString().slice(0, 10);
};

export const longDate = isoDate => {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(y, m - 1, d)));
};

const span = ms => {
  const mins = Math.max(1, Math.round(ms / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
};

// One plain sentence about where the sun is right now.
export function lightNow(now = new Date()) {
  const today = todayInDullstroom(now);
  const t = sunTimes(today);
  if (now < t.sunrise) return `Still dark. First light is in ${span(t.sunrise - now)}.`;
  if (now < t.morningEnd) return `It is golden hour right now, for another ${span(t.morningEnd - now)}.`;
  if (now < t.eveningStart) return `The sun is high. The evening gold starts in ${span(t.eveningStart - now)}.`;
  if (now < t.sunset) return `It is golden hour right now, for another ${span(t.sunset - now)}.`;
  const tomorrow = sunTimes(addDays(today, 1));
  return `The sun has set. First light is in ${span(tomorrow.sunrise - now)}.`;
}
