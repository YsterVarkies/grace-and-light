import BlurText from './reactbits/BlurText.jsx';
import { pictures } from '../data/site.js';

const asset = path => `${import.meta.env.BASE_URL}${path}`;

// What the name means, in the photographer's own words (from her Instagram
// introduction), beside her mark.
export default function Intro() {
  const logo = pictures.logo;
  return (
    <section className="section intro" id="about">
      <div className="grid">
        <BlurText
          as="h2"
          className="head intro__head"
          text="What the name means"
          delay={70}
          direction="bottom"
          blur={14}
          distance={26}
        />

        <figure className="intro__mark" data-rise="self">
          <img
            src={asset(logo.src)}
            width={logo.width}
            height={logo.height}
            alt={logo.alt}
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="intro__words" data-rise>
          <p className="statement">
            Grace is God’s undeserved love, kindness and mercy. Light is His presence, truth and hope.
          </p>
          <p>
            In photography, light is what brings every image to life. Together, Grace &amp; Light is my heart behind the
            camera: capturing God’s grace and the light He places in every story.
          </p>
          <p>
            I am based in Dullstroom and photograph couples, families, portraits, guesthouses and lifestyle across the
            surrounding areas.
          </p>
        </div>
      </div>
    </section>
  );
}
