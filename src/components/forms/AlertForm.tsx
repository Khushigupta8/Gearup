'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

/** "Tell me when a match arrives" stock alert form. */
export function AlertForm({ doneText = 'Alert set. We will be in touch when a match arrives.' }: { doneText?: string }) {
  const [done, setDone] = useState(false);

  return (
    <form
      className="alertform"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true); // TODO: POST /api/enquiries
      }}
    >
      {done ? (
        <div className="success" style={{ gridColumn: '1/-1' }}>
          <Icon name="check" />
          {doneText}
        </div>
      ) : (
        <>
          <div className="sel">
            <label className="sr" htmlFor="al1">
              Style
            </label>
            <select id="al1">
              <option>Any style</option>
              <option>Adventure</option>
              <option>Naked</option>
              <option>Sportsbike</option>
              <option>125cc</option>
            </select>
            <Icon name="down" />
          </div>
          <div>
            <label className="sr" htmlFor="al2">
              Email or mobile
            </label>
            <input id="al2" placeholder="Email or mobile" required />
          </div>
          <button className="btn btn-red">Alert me</button>
        </>
      )}
    </form>
  );
}
