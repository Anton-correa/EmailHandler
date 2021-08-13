const validate = require('../validate')
describe('Validate function testing', () => {

  it('should return true if this is correct action', () => {
    expect(validate.valAction('open')).toBe(true);
  });

  it('should return false if this is incorrect action', () => {
    expect(validate.valAction('fallout76')).toBe(false);
  });

it('should return true if this is correct subject', () => {
    expect(validate.valSubject('This is the subject')).toBe(true);
  });

  it('should return false if this is an empty subject', () => {
    expect(validate.valSubject('')).toBe(false);
  });

it('should return true if this is correct recipient', () => {
    expect(validate.valRecipient('todd@skyrim.net')).toBe(true);
  });

  it('should return false if this is incorrect recipient', () => {
    expect(validate.valRecipient('toddskyrimnet')).toBe(false);
  });

it('should return true if this is correct timestamp', () => {
    expect(validate.valTimestamp(new Date('2012-03-02T12:22:20'))).toBe(true);
  });

  it('should return false if this is incorrect timestamp', () => {
    expect(validate.valTimestamp('1222:20')).toBe(false);
  });

})
