import type { Metadata } from 'next';
import Link from 'next/link';
import { BikeListing } from '@/components/bikes/BikeListing';
import { AlertForm } from '@/components/forms/AlertForm';
import { ChipGroup } from '@/components/ui/ChipGroup';
import { Icon } from '@/components/ui/Icon';
import { bikes } from '@/data/bikes';

export const metadata: Metadata = {
  title: 'Motorbikes for Sale',
  description: 'Browse quality used motorbikes. Every bike HPI checked, inspected and warranted, with finance, part-exchange and UK delivery.',
};

/** Sidebar filter groups: [label, count, checked?]. Counts are sample figures until filtering comes from the API. */
const filterGroups: { title: string; options: [string, number | null, boolean?][] }[] = [
  {
    title: 'Make',
    options: [['Honda', 6], ['Yamaha', 4], ['Kawasaki', 4, true], ['Triumph', 3], ['BMW', 2], ['Suzuki', 2], ['Harley-Davidson', 1], ['Lexmoto', 2]],
  },
  {
    title: 'Style',
    options: [['Sportsbike', 4], ['Naked', 6], ['Adventure', 5], ['Cruiser', 3], ['Classic', 2], ['Scooter/Moped', 4], ['Tourer', 1], ['Enduro', 1]],
  },
  {
    title: 'Engine size',
    options: [['50cc moped', 3], ['51cc to 125cc', 7], ['126cc to 500cc', 5], ['501cc to 900cc', 7], ['Over 900cc', 5]],
  },
  { title: 'Licence', options: [['CBT / learner legal', 7], ['A2 compatible', 6], ['Full A licence', 11]] },
];

const extras: [string, number | null][] = [
  ['Free extended warranty', 5],
  ['Price drops', 3],
  ['Has walkaround video', 24],
  ['Hide reserved bikes', null],
];

function Checks({ options }: { options: [string, number | null, boolean?][] }) {
  return options.map(([label, count, checked]) => (
    <label key={label}>
      <span>
        <input type="checkbox" defaultChecked={checked} />
        {label}
      </span>
      <i>{count}</i>
    </label>
  ));
}

function Select({ options }: { options: string[] }) {
  return (
    <div className="sel">
      <select aria-label={options[0]}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <Icon name="down" />
    </div>
  );
}

function Filters() {
  const [make, style, engine, licence] = filterGroups;
  return (
    <>
      <div className="fh">
        <b>
          <Icon name="filter" />
          Filter bikes
        </b>
        <Link href="/used-bikes">Clear all</Link>
      </div>
      {[make, style].map((g) => (
        <div key={g.title} className="fgroup">
          <h4>{g.title}</h4>
          <Checks options={g.options} />
        </div>
      ))}
      <div className="fgroup">
        <h4>Budget</h4>
        <ChipGroup className="seg" style={{ margin: '0 0 10px' }} items={['Total', 'Monthly']} label="Budget type" />
        <div className="two">
          <Select options={['Min £', '£2,000', '£4,000']} />
          <Select options={['Max £', '£5,000', '£8,000', '£12,000']} />
        </div>
      </div>
      {[engine, licence].map((g) => (
        <div key={g.title} className="fgroup">
          <h4>{g.title}</h4>
          <Checks options={g.options} />
        </div>
      ))}
      <div className="fgroup">
        <h4>Year and mileage</h4>
        <div className="two">
          <Select options={['Year from', '2018', '2020', '2022']} />
          <Select options={['Max miles', '5,000', '10,000', '20,000']} />
        </div>
      </div>
      <div className="fgroup">
        <h4>Extras</h4>
        <Checks options={extras} />
      </div>
    </>
  );
}

const promoTile = (
  <div className="promo-tile">
    <div>
      <span className="lab" style={{ fontSize: 13 }}>
        Part exchange
      </span>
      <h3>What&apos;s your bike worth?</h3>
      <p>Use your current bike as the deposit on any of these.</p>
    </div>
    <Link href="/part-exchange" className="btn btn-white">
      Value my bike <Icon name="right" />
    </Link>
  </div>
);

export default function UsedBikesPage() {
  return (
    <>
      <section className="phero">
        <div className="slab" aria-hidden="true"></div>
        <div className="wrap">
          <div>
            <div className="crumbs">
              <Link href="/">Home</Link>
              <span className="s">/</span>
              <span>Motorbikes</span>
            </div>
            <h1 className="disp">
              Motorbikes <em>in stock</em>
            </h1>
            <p className="lede">
              24 bikes ready to ride. Every one HPI checked, 120-point inspected and sold with warranty. Reserve any bike online for £99.
            </p>
          </div>
          <div className="pbox">
            <b>24</b>
            <small>bikes in stock today, from £2,295 or £68/month</small>
          </div>
        </div>
      </section>

      <section className="sec" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <ChipGroup
            className="ntabs"
            label="New or used"
            items={[
              <>
                All bikes <i>24</i>
              </>,
              <>
                Used <i>21</i>
              </>,
              <>
                New <i>3</i>
              </>,
            ]}
          />
          <ChipGroup
            className="chips"
            itemClassName="chip"
            style={{ marginBottom: 26 }}
            label="Quick filters"
            items={['All bikes', 'Under £5,000', '125cc & learner', '50cc moped', 'A2 compatible', 'Free warranty', 'Price drops', 'Just arrived']}
          />
          <BikeListing bikes={bikes} filters={<Filters />} promo={promoTile} />
        </div>
      </section>

      <section className="alertband">
        <div className="wrap">
          <div>
            <h2 className="disp">
              Can&apos;t see <em>the one?</em>
            </h2>
            <p>Set an alert and we will message you the moment a match arrives, before it goes online.</p>
          </div>
          <AlertForm doneText="Alert set. We will be in touch." />
        </div>
      </section>
    </>
  );
}
