import compareVersions from 'compare-versions'
import { compareVersion } from '../compareVersion'
/*
https://github.com/omichelsen/compare-versions

compareVersions.compare('10.1.8', '10.0.4', '>'); // return true
compareVersions.compare('10.0.1', '10.0.1', '='); // return true
compareVersions.compare('10.1.1', '10.2.2', '<'); // return true
compareVersions.compare('10.1.1', '10.2.2', '<='); // return true
compareVersions.compare('10.1.1', '10.2.2', '>='); // return false
 */
describe('compare versions test', () => {
  it('compares version numbers correctly', () => {
    expect(compareVersions.compare('10.1.8', '10.0.4', '>')).toBe(true)
    expect(compareVersions.compare('1.4.100', '1.5.1000', '<')).toBe(true)
    expect(compareVersions.compare('1.5.1000', '1.4.100', '>')).toBe(true)
    expect(compareVersions.compare('1.4.1000', '1.5.0', '>')).toBe(false)
    expect(compareVersions.compare('1.4.1000', '1.4.1000', '=')).toBe(true)
  })

  it('compares version numbers correctly using local method', () => {
    expect(compareVersion('10.1.8', '>', '10.0.4')).toBe(true)
    expect(compareVersion('1.4.100', '<', '1.5.1000')).toBe(true)
    expect(compareVersion('1.5.1000', '>', '1.4.100')).toBe(true)
    expect(compareVersion('1.4.1000', '>', '1.5.0')).toBe(false)
    expect(compareVersion('1.4.2001', '<', '1.4.2002')).toBe(true)
    expect(compareVersion('1.4.2002', '=', '1.4.2002')).toBe(true)
    expect(compareVersion('1.4.2003', '>', '1.4.2002')).toBe(true)

    expect(compareVersion('1.5.2001', '>', '1.4.2002')).toBe(true)
    expect(compareVersion('1.5.2002', '>', '1.4.2002')).toBe(true)
    expect(compareVersion('1.5.2003', '>', '1.4.2002')).toBe(true)
    expect(compareVersion('1.8.1.1000', '>', '1.8.0.2000')).toBe(true)
    expect(compareVersion('1.8.1.1000', '>', null)).toBe(true)
    expect(compareVersion('1.8.1.1000', '>', undefined)).toBe(true)
    expect(compareVersion('1.8.1.1000', '>', 0)).toBe(true)
    expect(compareVersion('1.8.1.1000', '>', '0')).toBe(true)
    expect(compareVersion(0, '<', 1)).toBe(true)
    expect(compareVersion('1', '<', '')).toBe(false)
  })
})
