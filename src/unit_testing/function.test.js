const validate = require('../validate')

test('testing action validation', () => {
    expect(validate.valAction('open')).toBeNull();
  });

test('testing subject validation', () => {
    expect(validate.valSubject('This is the subject')).toBeNull();
  });

test('testing recipient validation', () => {
    expect(validate.valRecipient('todd@skyrim.net')).toBeNull();
  });

test('testing timestamp validation', () => {
    expect(validate.valAction('2012-03-02T12:22:20')).toBeNull();
  });