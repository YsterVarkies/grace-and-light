import { useEffect, useState } from 'react';
import BlurText from './reactbits/BlurText.jsx';
import { photos } from '../data/photos.js';
import { clock, lightNow, sunTimes, todayInDullstroom } from '../lib/sun.js';

const asset = path => `${import.meta.env.BASE_URL}${path}`;

// Today's golden hours in Dullstroom, worked out live in the browser.
function useLight() {
  const read = () => {
    const now = new Date();
    return { times: sunTimes(todayInDullstroom(now)), sentence: lightNow(now) };
  };
  const [light, setLight] = useState(read);
  useEffect(() => {
    const id = setInterval(() => setLight(read()), 60000);
    return () => clearInterval(id);
  }, []);
  return light;
}

export default function Light() {
  const { times, sentence } = useLight();
  const p = photos.find(x => x.id === 'family-run');

  return (
    <section className="section light" id="light">
      <div className="light__grid">
        <figure className="arch light__pic" data-rise="self">
          <img
            data-drift
            src={asset(p.src)}
            width={p.width}
            height={p.height}
            alt={p.alt}
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="light__words">
          <BlurText
            as="h2"
            className="head"
            text="Planned around the light"
            delay={80}
            direction="bottom"
            blur={14}
            distance={26}
          />

          <div className="sun" data-rise>
            <h3 className="sun__title">Today in Dullstroom</h3>
            <dl className="sun__times">
              <div>
                <dt>Morning gold</dt>
                <dd>
                  {clock(times.sunrise)} to {clock(times.morningEnd)}
                </dd>
              </div>
              <div>
                <dt>Evening gold</dt>
                <dd>
                  {clock(times.eveningStart)} to {clock(times.sunset)}
                </dd>
              </div>
            </dl>
            <p className="sun__now" aria-live="polite">
              {sentence}
            </p>
          </div>

          <div className="stages" data-rise>
            <p>
              <strong>First, a message.</strong> Tell me who it is for and what you have in mind. We choose a place and
              a date, and I look up the light for that day.
            </p>
            <p>
              <strong>On the day,</strong> we meet about an hour before sunset, or just after sunrise if you are brave.
              There is no stiff posing. I guide, and you get on with being yourselves.
            </p>
            <p>
              <strong>Afterwards,</strong> I edit every frame by hand and send you an online gallery, ready to download
              and print.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
