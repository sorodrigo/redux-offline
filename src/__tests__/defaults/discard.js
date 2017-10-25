import discard from '../../defaults/discard'


test("don't discard is there's no error", function()
{
  const result = discard()

  expect(result).toBeFalsy()
})

describe("discard if error", function()
{
  test("don't have a defined status", function()
  {
    const result = discard({})

    expect(result).toBeTruthy()
  })

  test("status is set to undefined", function()
  {
    const result = discard({status: undefined})

    expect(result).toBeTruthy()
  })

  test("status is null", function()
  {
    const result = discard({status: null})

    expect(result).toBeTruthy()
  })
})

describe('error statuses', function()
{
  test("don't discard if network error has a success status", function()
  {
    const result = discard({status: 200})

    expect(result).toBeFalsy()
  })

  test("discard on client error", function()
  {
    const result = discard({status: 404})

    expect(result).toBeTruthy()
  })

  test("don't discard on server error", function()
  {
    const result = discard({status: 512})

    expect(result).toBeFalsy()
  })
})
