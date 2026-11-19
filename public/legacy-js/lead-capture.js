// Sends the bridged HTML page forms (contact, finance, insurance, part-exchange, workshop) to /api/leads.
// Runs in the capture phase, so it reads the fields before the page's own "thanks" message replaces the form.
// Remove once those pages are rebuilt as React components.
(function () {
  if (window.__guLeadCapture) return;
  window.__guLeadCapture = true;

  var SKIP = /^\/(login|account|used-bikes\/[^/]+\/reserve)/;

  function text(el) {
    return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
  }
  function labelFor(control) {
    if (control.id) {
      var l = document.querySelector('label[for="' + control.id + '"]');
      if (l) return text(l);
    }
    var wrap = control.closest('label');
    if (wrap) return text(wrap);
    return control.getAttribute('aria-label') || control.placeholder || control.name || control.id || 'Field';
  }
  /** The question above a group of radio cards, e.g. "What is it about?". */
  function groupLabel(radio) {
    var fs = radio.closest('fieldset');
    var legend = fs && fs.querySelector('legend');
    if (legend) return text(legend);
    var box = radio.closest('.radios, .rcards, .opts') || radio.closest('label').parentElement;
    for (var el = box; el && el !== radio.form; el = el.parentElement) {
      for (var sib = el.previousElementSibling; sib; sib = sib.previousElementSibling) {
        if (sib.matches('.qlbl, .h4, h2, h3, h4, legend, label')) return text(sib).replace(/^\d+\s*/, '');
      }
    }
    return 'Option';
  }
  /** The chosen option's title (the bold part of a radio card). */
  function optionLabel(radio) {
    var card = radio.closest('label');
    var title = card && card.querySelector('b');
    return title ? text(title) : labelFor(radio);
  }

  function leadType(path, form, fields) {
    if (path.indexOf('/contact') === 0) {
      var all = Object.keys(fields).map(function (k) { return fields[k]; }).join(' ');
      return /viewing|video/i.test(all) ? 'viewing' : 'enquiry';
    }
    if (path.indexOf('/finance') === 0) return 'finance';
    if (path.indexOf('/insurance') === 0) return 'insurance';
    if (path.indexOf('/part-exchange') === 0) return 'part_exchange';
    if (path.indexOf('/sell-your-bike') === 0) return 'sell_bike';
    if (path.indexOf('/workshop') === 0) return 'workshop';
    return 'enquiry';
  }

  document.addEventListener(
    'submit',
    function (e) {
      var form = e.target;
      if (!(form instanceof HTMLFormElement) || form.dataset.react === '1') return;
      var path = location.pathname;
      if (SKIP.test(path)) return;

      var fields = {};
      var name = [];
      var email = '';
      var phone = '';
      var message = '';
      var consent = false;
      var seenRadio = {};

      Array.prototype.forEach.call(form.querySelectorAll('input, select, textarea'), function (c) {
        if (c.type === 'file' || c.type === 'hidden' || c.type === 'submit' || c.type === 'password') return;
        if (c.type === 'radio') {
          if (seenRadio[c.name]) return;
          seenRadio[c.name] = true;
          var checked = form.querySelector('input[type=radio][name="' + c.name + '"]:checked');
          if (checked) fields[groupLabel(c)] = optionLabel(checked);
          return;
        }
        var label = labelFor(c);
        if (c.type === 'checkbox') {
          if (/offer|news|marketing|email me/i.test(label)) consent = c.checked;
          if (c.checked) fields[label.slice(0, 90)] = 'Yes';
          return;
        }
        var value = (c.value || '').trim();
        if (c.tagName === 'SELECT' && c.selectedIndex >= 0) value = text(c.options[c.selectedIndex]);
        if (!value) return;
        if (c.type === 'email') email = value;
        else if (/mobile|phone|tel/i.test(label) || c.type === 'tel') phone = value;
        else if (/first name|last name|full name|your name|^name$/i.test(label)) name.push(value);
        else if (c.tagName === 'TEXTAREA') message = value;
        fields[label.slice(0, 90)] = value.slice(0, 2000);
      });

      if (!email && phone.replace(/\D/g, '').length < 7) return; // search boxes, quick valuation teasers, etc.

      var payload = {
        type: leadType(path, form, fields),
        name: name.join(' '),
        email: email,
        phone: phone,
        message: message,
        fields: fields,
        sourcePage: path,
        marketingConsent: consent,
      };
      try {
        fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true });
      } catch {
        /* the page's own thank-you still shows; staff can be called */
      }
    },
    true,
  );
})();
