import discard from '../../defaults/discard';

test("don't discard is there's no error", () => {
  const result = discard();

  expect(result).toBeFalsy();
});

describe('discard if error', () => {
  test("don't have a defined status", () => {
    const result = discard({});

    expect(result).toBeTruthy();
  });

  test('status is set to undefined', () => {
    const result = discard({ status: undefined });

    expect(result).toBeTruthy();
  });

  test('status is null', () => {
    const result = discard({ status: null });

    expect(result).toBeTruthy();
  });
});

describe('error statuses', () => {
  test("don't discard if network error is zero (null number)", () => {
    const result = discard({ status: 0 });

    expect(result).toBeFalsy();
  });

  test("don't discard if network error has a success status", () => {
    const result = discard({ status: 200 });

    expect(result).toBeFalsy();
  });

  test('discard on client error', () => {
    const result = discard({ status: 404 });

    expect(result).toBeTruthy();
  });

  test("don't discard on server error", () => {
    const result = discard({ status: 512 });

    expect(result).toBeFalsy();
  });
});
