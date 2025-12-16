import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { checkSeatsAvailability } from './checkSeatsAvailability.js';

describe('checkSeatsAvailability - Unit Tests', () => {
  let mockShow;

  beforeEach(() => {
    // Reset mock before each test
    mockShow = {
      findById: jest.fn()
    };
  });

  describe('Successful seat availability checks', () => {
    it('should return true when all selected seats are available', async () => {
      // Arrange
      const showId = 'show123';
      const selectedSeats = ['A1', 'A2', 'A3'];
      const mockShowData = {
        occupiedSeats: {
          'B1': true,
          'B2': true,
          'C1': true
        }
      };
      mockShow.findById.mockResolvedValue(mockShowData);

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(true);
      expect(mockShow.findById).toHaveBeenCalledWith(showId);
      expect(mockShow.findById).toHaveBeenCalledTimes(1);
    });

    it('should return true when no seats are occupied at all', async () => {
      // Arrange
      const showId = 'show456';
      const selectedSeats = ['A1', 'A2', 'A3', 'B1', 'B2'];
      const mockShowData = {
        occupiedSeats: {}
      };
      mockShow.findById.mockResolvedValue(mockShowData);

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(true);
      expect(mockShow.findById).toHaveBeenCalledWith(showId);
    });

    it('should return true when selecting a single available seat', async () => {
      // Arrange
      const showId = 'show789';
      const selectedSeats = ['D5'];
      const mockShowData = {
        occupiedSeats: {
          'D1': true,
          'D2': true,
          'D3': true
        }
      };
      mockShow.findById.mockResolvedValue(mockShowData);

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when empty selectedSeats array is provided', async () => {
      // Arrange
      const showId = 'show111';
      const selectedSeats = [];
      const mockShowData = {
        occupiedSeats: {
          'A1': true,
          'B1': true
        }
      };
      mockShow.findById.mockResolvedValue(mockShowData);

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(true); // No seats to check, so none are occupied
    });
  });

  describe('Seat unavailability scenarios', () => {
    it('should return false when one of the selected seats is occupied', async () => {
      // Arrange
      const showId = 'show222';
      const selectedSeats = ['A1', 'A2', 'A3'];
      const mockShowData = {
        occupiedSeats: {
          'A2': true, // This seat is occupied
          'B1': true
        }
      };
      mockShow.findById.mockResolvedValue(mockShowData);

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(false);
      expect(mockShow.findById).toHaveBeenCalledWith(showId);
    });

    it('should return false when all selected seats are occupied', async () => {
      // Arrange
      const showId = 'show333';
      const selectedSeats = ['A1', 'A2', 'A3'];
      const mockShowData = {
        occupiedSeats: {
          'A1': true,
          'A2': true,
          'A3': true
        }
      };
      mockShow.findById.mockResolvedValue(mockShowData);

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when the last selected seat is occupied', async () => {
      // Arrange
      const showId = 'show444';
      const selectedSeats = ['A1', 'A2', 'A3', 'A4'];
      const mockShowData = {
        occupiedSeats: {
          'A4': true // Last seat is occupied
        }
      };
      mockShow.findById.mockResolvedValue(mockShowData);

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when multiple selected seats are occupied', async () => {
      // Arrange
      const showId = 'show555';
      const selectedSeats = ['A1', 'A2', 'A3', 'B1', 'B2'];
      const mockShowData = {
        occupiedSeats: {
          'A1': true,
          'B2': true,
          'C1': true
        }
      };
      mockShow.findById.mockResolvedValue(mockShowData);

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Error handling scenarios', () => {
    it('should return false when show is not found', async () => {
      // Arrange
      const showId = 'nonexistent123';
      const selectedSeats = ['A1', 'A2'];
      mockShow.findById.mockResolvedValue(null); // Show not found

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(false);
      expect(mockShow.findById).toHaveBeenCalledWith(showId);
    });

    it('should return false when show is undefined', async () => {
      // Arrange
      const showId = 'show666';
      const selectedSeats = ['A1', 'A2'];
      mockShow.findById.mockResolvedValue(undefined);

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when database query throws an error', async () => {
      // Arrange
      const showId = 'show777';
      const selectedSeats = ['A1', 'A2'];
      const dbError = new Error('Database connection failed');
      mockShow.findById.mockRejectedValue(dbError);

      // Spy on console.log to verify error logging
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(false);
      expect(consoleLogSpy).toHaveBeenCalledWith(dbError.message);
      
      // Cleanup
      consoleLogSpy.mockRestore();
    });

    it('should handle occupiedSeats as null gracefully', async () => {
      // Arrange
      const showId = 'show888';
      const selectedSeats = ['A1', 'A2'];
      const mockShowData = {
        occupiedSeats: null
      };
      mockShow.findById.mockResolvedValue(mockShowData);

      // Act & Assert - This should throw an error but the function catches it
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);
      expect(result).toBe(false);
    });
  });

  describe('Edge cases and boundary conditions', () => {
    it('should handle seats with special characters', async () => {
      // Arrange
      const showId = 'show999';
      const selectedSeats = ['VIP-1', 'VIP-2', 'BALCONY_A1'];
      const mockShowData = {
        occupiedSeats: {
          'VIP-3': true,
          'BALCONY_B1': true
        }
      };
      mockShow.findById.mockResolvedValue(mockShowData);

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(true);
    });

    it('should handle numeric seat identifiers', async () => {
      // Arrange
      const showId = 'show1000';
      const selectedSeats = ['1', '2', '3'];
      const mockShowData = {
        occupiedSeats: {
          '4': true,
          '5': true
        }
      };
      mockShow.findById.mockResolvedValue(mockShowData);

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(true);
    });

    it('should correctly evaluate falsy values in occupiedSeats', async () => {
      // Arrange
      const showId = 'show1001';
      const selectedSeats = ['A1', 'A2'];
      const mockShowData = {
        occupiedSeats: {
          'A1': false, // Explicitly false (not occupied)
          'A3': true
        }
      };
      mockShow.findById.mockResolvedValue(mockShowData);

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(true); // false is falsy, so seat is available
    });

    it('should handle large number of selected seats', async () => {
      // Arrange
      const showId = 'show1002';
      const selectedSeats = Array.from({ length: 100 }, (_, i) => `SEAT_${i}`);
      const mockShowData = {
        occupiedSeats: {
          'DIFFERENT_SEAT': true
        }
      };
      mockShow.findById.mockResolvedValue(mockShowData);

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(true);
    });

    it('should be case-sensitive for seat identifiers', async () => {
      // Arrange
      const showId = 'show1003';
      const selectedSeats = ['a1', 'a2']; // lowercase
      const mockShowData = {
        occupiedSeats: {
          'A1': true, // uppercase - should not match
          'A2': true
        }
      };
      mockShow.findById.mockResolvedValue(mockShowData);

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(true); // Case-sensitive, so lowercase a1, a2 are available
    });
  });

  describe('Performance and optimization checks', () => {
    it('should call findById only once per execution', async () => {
      // Arrange
      const showId = 'show1004';
      const selectedSeats = ['A1', 'A2', 'A3', 'B1', 'B2'];
      const mockShowData = {
        occupiedSeats: {
          'C1': true
        }
      };
      mockShow.findById.mockResolvedValue(mockShowData);

      // Act
      await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(mockShow.findById).toHaveBeenCalledTimes(1);
    });

    it('should short-circuit when first occupied seat is found', async () => {
      // Arrange
      const showId = 'show1005';
      const selectedSeats = ['A1', 'A2', 'A3', 'A4', 'A5'];
      const mockShowData = {
        occupiedSeats: {
          'A1': true, // First seat is occupied
          'A2': true,
          'A3': true
        }
      };
      mockShow.findById.mockResolvedValue(mockShowData);

      // Act
      const result = await checkSeatsAvailability(mockShow, showId, selectedSeats);

      // Assert
      expect(result).toBe(false);
      // The some() method should stop at first match
    });
  });
});
