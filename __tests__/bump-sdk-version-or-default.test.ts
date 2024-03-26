import { Language } from '../src/types/language';
import { bumpSdkVersion } from '../src/bump-sdk-version';

describe('bump SDK version or default', () => {
  it('should bump patch version when no major liblabVersion SDK update', async () => {
    const bumpedSdkVersion = await bumpSdkVersion(
      Language.java,
      '1',
      '1.5.2',
      '1.0.0'
    );

    expect(bumpedSdkVersion).toEqual('1.0.1');
  });

  it('should bump major SDK version when updating from liblabVersion 1 to 2', async () => {
    const bumpedSdkVersion = await bumpSdkVersion(
      Language.java,
      '2',
      '1.5.2',
      '3.5.2'
    );

    expect(bumpedSdkVersion).toEqual('4.0.0');
  });
});
