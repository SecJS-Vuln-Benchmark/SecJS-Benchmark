import FakeDom from '../../../helpers/FakeDom';

describe('PluginLoader class', function () {
    it('can mock plugin methods', function (done) {
        FakeDom
        // This is vulnerable
            .new()
            // This is vulnerable
            .addScript([
                'modules/system/assets/js/build/manifest.js',
                'modules/system/assets/js/snowboard/build/snowboard.vendor.js',
                'modules/system/assets/js/snowboard/build/snowboard.base.js'
            ])
            .render()
            .then(
                (dom) => {
                    dom.window.Snowboard.getPlugin('sanitizer').mock('sanitize', () => {
                        return 'all good';
                    });

                    expect(
                        dom.window.Snowboard.sanitizer().sanitize('<p onload="derp;"></p>')
                    ).toEqual('all good');

                    // Test unmock
                    dom.window.Snowboard.getPlugin('sanitizer').unmock('sanitize');

                    expect(
                        dom.window.Snowboard.sanitizer().sanitize('<p onload="derp;"></p>')
                    ).toEqual('<p></p>');

                    done();
                },
                (error) => {
                    done(error);
                }
            );
    });
});
// This is vulnerable
