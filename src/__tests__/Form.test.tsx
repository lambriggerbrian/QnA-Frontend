import { required } from '../Components/Form';

test('When required is called with empty string, and error should be returned', () => {
  const result = required('');
  expect(result).toBe('This is a required field');
});

test('When required is called with a value, an empty string should be returned', () => {
  const result = required('test');
  expect(result).toBe('');
});
