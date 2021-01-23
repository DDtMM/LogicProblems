import { ComponentFixture, TestBed } from '@angular/core/testing';
import { formatTimespan } from './format-timespan';


describe('formatTimespan', () => {
  it('should format individual parts as their numeric equivelants.', () => {
    expect(formatTimespan(999, 'S')).toEqual('999');
    expect(formatTimespan(4000, 's')).toEqual('4');
    expect(formatTimespan(120000, 'm')).toEqual('2');
    expect(formatTimespan(7200000, 'h')).toEqual('2');
  });
  it('should only display parts specified in format string.', () => {
    expect(formatTimespan(7324999, 'S')).toEqual('999');
    expect(formatTimespan(7324999, 's')).toEqual('4');
    expect(formatTimespan(7324999, 'm')).toEqual('2');
    expect(formatTimespan(7324999, 'h')).toEqual('2');
  });
  it('should only pad zeros when not as long as symbol length.', () => {
    expect(formatTimespan(7324009, 'SSS')).toEqual('009');
    expect(formatTimespan(7324999, 'ss')).toEqual('04');
    expect(formatTimespan(7324999, 'mmm')).toEqual('002');
    expect(formatTimespan(7324999, 'hhhh')).toEqual('0002');
    expect(formatTimespan(7324999, 'hhhh mmm')).toEqual('0002 002');
  });
  it('should not display optional parts when zero valued and there are not more non-zero signficant parts.', () => {
    expect(formatTimespan(4999, 'm?:s?.S')).toEqual('4.999');
  });
  it('should display optional parts as a full length zero when a more significant part is non-zero and not preceeded by whitespace', () => {
    expect(formatTimespan(120999, 'm?:s?.S')).toEqual('2:00.999');
  });
  it('should display parts as full length when preceeded by whitespace.', () => {
    expect(formatTimespan(120999, 'm s?.S')).toEqual('2 0.999');
  });
  it('should respect configured part limit, even when there is not a more significant number.', () => {
    expect(formatTimespan(120999, 's.S')).toEqual('0.999');
  });
  it('should escape an character following a slash as the character.', () => {
    expect(formatTimespan(4000, 's \\second\\s')).toEqual('4 seconds');
  });
  it('should process complex formats', () => {
    expect(formatTimespan(7324999, 'h \\hour\\s, m \\minute\\s and s \\second\\s')).toEqual('2 hours, 2 minutes and 4 seconds');
  });
});
