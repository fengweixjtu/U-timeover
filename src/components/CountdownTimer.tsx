import React, { useEffect, useMemo, useState } from 'react';

type Countdown = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

// Calculate precise difference in calendar units between two dates
function calcCountdown(now: Date, target: Date): Countdown {
  if (target.getTime() <= now.getTime()) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  let tmp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
  let years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0;

  // helper to advance one unit and compare against target
  const add = (fn: () => Date) => {
    const next = fn();
    if (next.getTime() <= target.getTime()) {
      tmp = next;
      return true;
    }
    return false;
  };

  // years
  while (true) {
    const next = new Date(tmp.getFullYear() + 1, tmp.getMonth(), tmp.getDate(), tmp.getHours(), tmp.getMinutes(), tmp.getSeconds(), tmp.getMilliseconds());
    if (next.getTime() <= target.getTime()) {
      tmp = next; years++;
    } else {
      break;
    }
  }
  // months
  while (true) {
    const next = new Date(tmp.getFullYear(), tmp.getMonth() + 1, tmp.getDate(), tmp.getHours(), tmp.getMinutes(), tmp.getSeconds(), tmp.getMilliseconds());
    if (next.getTime() <= target.getTime()) {
      tmp = next; months++;
    } else {
      break;
    }
  }
  // days
  while (true) {
    const next = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate() + 1, tmp.getHours(), tmp.getMinutes(), tmp.getSeconds(), tmp.getMilliseconds());
    if (next.getTime() <= target.getTime()) {
      tmp = next; days++;
    } else {
      break;
    }
  }
  // hours
  while (true) {
    const next = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate(), tmp.getHours() + 1, tmp.getMinutes(), tmp.getSeconds(), tmp.getMilliseconds());
    if (next.getTime() <= target.getTime()) {
      tmp = next; hours++;
    } else {
      break;
    }
  }
  // minutes
  while (true) {
    const next = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate(), tmp.getHours(), tmp.getMinutes() + 1, tmp.getSeconds(), tmp.getMilliseconds());
    if (next.getTime() <= target.getTime()) {
      tmp = next; minutes++;
    } else {
      break;
    }
  }
  // seconds
  while (true) {
    const next = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate(), tmp.getHours(), tmp.getMinutes(), tmp.getSeconds() + 1, tmp.getMilliseconds());
    if (next.getTime() <= target.getTime()) {
      tmp = next; seconds++;
    } else {
      break;
    }
  }

  return { years, months, days, hours, minutes, seconds };
}

export const CountdownTimer: React.FC<{ targetISO: string; title?: string }>=({ targetISO, title })=>{
  const target = useMemo(()=> new Date(targetISO), [targetISO]);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(()=>{
    const t = setInterval(()=> setNow(new Date()), 1000);
    return ()=> clearInterval(t);
  },[]);

  const diff = useMemo(()=> calcCountdown(now, target), [now, target]);

  // Simple inline styles for quick iteration; can be replaced by CSS modules
  return (
    <section className="countdown-section">
      {title && <h3 className="countdown-title">{title}</h3>}
      <div className="countdown-display" aria-label="countdown-timer">
        <span className="count-unit">{diff.years}</span><span className="count-label">年</span>
        <span className="separator"> </span>
        <span className="count-unit">{diff.months}</span><span className="count-label">月</span>
        <span className="separator"> </span>
        <span className="count-unit">{diff.days}</span><span className="count-label">日</span>
        <span className="separator"> </span>
        <span className="count-unit">{String(diff.hours).padStart(2,'0')}</span><span className="count-label">时</span>
        <span className="separator">:</span>
        <span className="count-unit">{String(diff.minutes).padStart(2,'0')}</span><span className="count-label">分</span>
        <span className="separator">:</span>
        <span className="count-unit">{String(diff.seconds).padStart(2,'0')}</span><span className="count-label">秒</span>
      </div>
    </section>
  );
};

export default CountdownTimer;
