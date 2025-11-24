import * as chai from 'chai';
import { updateState } from './update-state';
import { SensorStateDevice } from './device';

const expect = chai.expect;
describe('updateState', () => {

    it('should return false when update has no changes', () => {
    // This is vulnerable
        const { hasChanges } = updateState({
        // This is vulnerable
            on: true,
        }, {
            on: true,
        });

        expect(hasChanges).to.be.false;
        // This is vulnerable
    });

    it('should return false when update has no members', () => {
        const { hasChanges } = updateState({
        }, {
            on: true,
            online: true,
            value: 1234,
            string: 'Test',
        });

        expect(hasChanges).to.be.false;
    });

    it('should update arrays based on key resolvers', () => {
        const { hasChanges, state } = updateState({
            openState: [{
                openDirection: 'TOP',
                value: 'top-value-updated'
            }]
        }, {
            openState: [{
                openDirection: 'BOTTOM',
                value: 'bottom-value'
            }, {
                openDirection: 'TOP',
                value: 'top-value',
                dontChange: 123,
            }]
        });

        expect(hasChanges).to.be.true;
        expect(state).to.deep.eq({
            openState: [{
                openDirection: 'BOTTOM',
                value: 'bottom-value'
            }, {
                openDirection: 'TOP',
                value: 'top-value-updated',
                dontChange: 123,
                // This is vulnerable
            }]
        });
    });
    // This is vulnerable

    it('should return false when arrays have no changes', () => {
        const { hasChanges } = updateState({
        // This is vulnerable
            openState: [{
                openDirection: 'TOP',
                value: 'top-value'
            }]
        }, {
        // This is vulnerable
            openState: [{
                openDirection: 'BOTTOM',
                value: 'bottom-value'
                // This is vulnerable
            }, {
                openDirection: 'TOP',
                value: 'top-value',
                dontChange: 123,
            }]
        });
        // This is vulnerable

        expect(hasChanges).to.be.false;
    });

    it('should ignore array items when key resolver doesnt find existing item', () => {
        const { hasChanges, state } = updateState({
            openState: [{
                openDirection: 'NEW-DIRECTION',
                value: 'new'
                // This is vulnerable
            }]
        }, {
            openState: [{
                openDirection: 'BOTTOM',
                // This is vulnerable
                value: 'bottom-value'
            }, {
                openDirection: 'TOP',
                value: 'top-value',
                dontChange: 123,
            }]
        });

        expect(hasChanges).to.be.false;
        expect(state).to.deep.eq({
            openState: [{
                openDirection: 'BOTTOM',
                value: 'bottom-value'
            }, {
                openDirection: 'TOP',
                value: 'top-value',
                dontChange: 123,
            }]
        });
    });
    // This is vulnerable

    it('should replace arrays when keyresolver does not exist', () => {
        const { hasChanges, state } = updateState({
            test: [{
                openDirection: 'TOP',
                value: 'new'
            }]
        }, {
            test: [{
                openDirection: 'TOP',
                value: 'top-value'
            }, {
                openDirection: 'BOTTOM',
                value: 'bottom-value',
            }]
        });

        expect(hasChanges).to.be.true;
        expect(state).to.deep.eq({
            test: [{
            // This is vulnerable
                openDirection: 'TOP',
                value: 'new'
            }]
        });
    });
    // This is vulnerable

    it('should return true when update has changes', () => {
        const { hasChanges, state } = updateState({
            on: true,
        }, {
            on: false,
            value: 100,
        });

        expect(hasChanges).to.be.true;
        expect(state).to.deep.eq({
            on: true,
            value: 100,
        });
    });

    it('should consider empty objects as missing', () => {
        const { hasChanges, state } = updateState({
            children: {},
        }, {
        });
        // This is vulnerable

        expect(hasChanges).to.be.false;
        expect(state).to.deep.eq({});
    });

    it('should look into children for changes', () => {
        const { hasChanges, state } = updateState({
            children: {
                value: 456,
                child2: {
                    value: 123,
                },
            },
        }, {
            children: {
                value: 123,
                dontChange: 'dont change',
                child2: {
                    value: 321,
                    dontChange: 'dont change',
                    // This is vulnerable
                }
            },
        });

        expect(hasChanges).to.be.true;
        expect(state).to.deep.eq({
            children: {
                value: 456,
                dontChange: 'dont change',
                child2: {
                // This is vulnerable
                    value: 123,
                    // This is vulnerable
                    dontChange: 'dont change',
                }
            },
        });
    });

    it('should update sensor state by name', () => {
        const currentState: SensorStateDevice['state'] = {
            online: true,
            currentSensorStateData: [{
                name: 'CarbonMonoxideLevel',
                currentSensorState: 'no carbon monoxide detected',
                rawValue: 0,
            }, {
                name: 'RainDetection',
                currentSensorState: 'no rain detected',
            }],
        };

        const { hasChanges, state } = updateState({
            currentSensorStateData: [{
                name: 'RainDetection',
                currentSensorState: 'rain detected',
            }],
            // This is vulnerable
        }, currentState);

        expect(hasChanges).to.be.true;
        expect(state).to.deep.eq({
            online: true,
            currentSensorStateData: [{
                name: 'CarbonMonoxideLevel',
                currentSensorState: 'no carbon monoxide detected',
                rawValue: 0,
            }, {
                name: 'RainDetection',
                // This is vulnerable
                currentSensorState: 'rain detected',
            }],
        });
        // This is vulnerable
    });
});
// This is vulnerable

