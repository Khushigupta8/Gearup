import { Icon, type IconName } from '@/components/ui/Icon';

const steps: [IconName, string, string][] = [
  ['card', 'Reserve for £99', 'The bike comes off sale the moment you pay. The deposit comes off the price.'],
  ['wrench', 'Full PDI', 'A full pre-delivery inspection, tied to our 120-point check. Each stage ticks off in your account.'],
  ['truck', 'Collect or deliver', 'Collect from the showroom, or we deliver nationwide at a price per mile.'],
  ['key', 'Pay the balance & ride', "Pay what's left on collection or delivery. Keys, logbook and warranty handed over."],
];

/** "How buying online works" + "Bike history check" collapsibles (reserve and basket pages). */
export function HowItWorks({ history = true }: { history?: boolean }) {
  return (
    <>
      <details className="howbox">
        <summary>
          <span>
            <Icon name="info" />
            How buying online works
          </span>
          <small>4 simple steps</small>
        </summary>
        <ol className="how4">
          {steps.map(([icon, title, text], i) => (
            <li key={title}>
              <span className="ic">
                <Icon name={icon} />
              </span>
              <h4>
                <small>Step 0{i + 1}</small>
                {title}
              </h4>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </details>
      {history && (
        <details className="howbox">
          <summary>
            <span>
              <Icon name="shield" />
              Bike history check for this bike
            </span>
            <small>All clear</small>
          </summary>
          <div className="hchecks" style={{ justifyContent: 'flex-start', padding: '4px 0 6px' }}>
            {['Not reported stolen', 'Not scrapped', 'Not written off', 'No outstanding finance'].map((c) => (
              <span key={c}>
                <Icon name="check" />
                {c}
              </span>
            ))}
          </div>
        </details>
      )}
    </>
  );
}
