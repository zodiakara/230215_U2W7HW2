// describe("testing the library", () => {}); // keyword to group tests

describe("Testing the library", () => {
  it("Should test that true is true", () => {
    // the keywords for tests are 2 (interchangeable): "it" and "test"
    expect(true).toBe(true);
  });
  it("Should test that true is true", () => {
    // the keywords for tests are 2 (interchangeable): "it" and "test"
    expect(true).toBe(true);
  });

  it("Should test null", () => {
    const n = null;
    expect(n).toBeNull();
    expect(n).toBeDefined();
    expect(n).not.toBeUndefined();
    expect(n).not.toBeTruthy();
    expect(n).toBeFalsy();
  });

  it("Should test that 2 + 2 is 4", () => {
    expect(2 + 2).toBe(4);
  });
});

describe("Testing it with another describe", () => {
  it("Should test that false is false", () => {
    expect(false).toBe(false);
  });
});
