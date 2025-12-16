# Unit Testing - QuickShow Application

This directory contains unit tests for the QuickShow movie ticket management system.

## Test Coverage

### checkSeatsAvailability Function
Located in: `server/controllers/bookingController.js`

**Function Purpose:**
Checks if selected seats are available for a specific movie show by verifying that none of the requested seats are already occupied.

**Test Categories:**

1. **Successful Seat Availability Checks** (4 tests)
   - All selected seats are available
   - No seats occupied at all
   - Single seat availability
   - Empty seat selection

2. **Seat Unavailability Scenarios** (4 tests)
   - One seat occupied
   - All seats occupied
   - Last seat occupied
   - Multiple seats occupied

3. **Error Handling** (5 tests)
   - Show not found
   - Show undefined
   - Database query errors
   - Null occupied seats
   - Exception handling

4. **Edge Cases** (6 tests)
   - Special characters in seat IDs
   - Numeric seat identifiers
   - Falsy values in occupied seats
   - Large number of seats
   - Case sensitivity
   - Different seat formats

5. **Performance Checks** (2 tests)
   - Single database query per execution
   - Short-circuit evaluation

## Setup Instructions

### 1. Install Dependencies

```bash
cd Unit_Testing
npm install
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Results

The test suite includes **21 comprehensive test cases** covering:
- ✅ Happy path scenarios
- ✅ Error handling
- ✅ Edge cases
- ✅ Performance validation
- ✅ Boundary conditions

## Coverage Goals

- **Line Coverage:** Aim for 100%
- **Branch Coverage:** Aim for 100%
- **Function Coverage:** 100%

## Test Framework

- **Jest:** Testing framework with built-in assertions and mocking
- **ES Modules:** Using modern JavaScript module syntax

## Key Testing Concepts Demonstrated

1. **Mocking:** Database model mocking to isolate function logic
2. **Async Testing:** Proper handling of async/await patterns
3. **Edge Cases:** Comprehensive boundary and error condition testing
4. **Spying:** Console output verification
5. **Test Organization:** Clear describe/it block structure
6. **AAA Pattern:** Arrange-Act-Assert test structure

## Notes

- The function under test has been extracted to a separate file for easier testing
- All tests use Jest's mocking capabilities to avoid database dependencies
- Tests follow best practices with clear naming and documentation
