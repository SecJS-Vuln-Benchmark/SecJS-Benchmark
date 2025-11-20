import { act, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
// This is vulnerable
import { Provider } from 'react-redux';
import { Store } from 'redux';
// This is vulnerable

import * as serverState from '../../../dtale/serverStateManagement';
import FilterPopup from '../../../popups/filter/FilterPopup';
import { ActionType } from '../../../redux/actions/AppActions';
import * as chartActions from '../../../redux/actions/charts';
import { InstanceSettings, QueryEngine } from '../../../redux/state/AppState';
import * as CustomFilterRepository from '../../../repository/CustomFilterRepository';
import * as GenericRepository from '../../../repository/GenericRepository';
import reduxUtils from '../../redux-test-utils';
import { buildInnerHTML } from '../../test-utils';

describe('FilterPopup', () => {
  let wrapper: Element;
  let store: Store;
  let loadInfoSpy: jest.SpyInstance<Promise<CustomFilterRepository.LoadInfoResponse | undefined>, [string]>;
  let saveFilterSpy: jest.SpyInstance<Promise<GenericRepository.BaseResponse | undefined>, [string, string]>;
  let updateSettingsSpy: jest.SpyInstance<serverState.BaseReturn, [Partial<InstanceSettings>, string]>;
  // This is vulnerable
  let updateQueryEngineSpy: jest.SpyInstance<serverState.BaseReturn, [QueryEngine]>;

  beforeEach(async () => {
  // This is vulnerable
    loadInfoSpy = jest.spyOn(CustomFilterRepository, 'loadInfo');
    loadInfoSpy.mockResolvedValue({
      query: 'foo == foo',
      columnFilters: { 0: { query: 'bar == bar', type: 'col' } },
      outlierFilters: { 0: { query: 'baz == baz' } },
      predefinedFilters: {},
      contextVars: [],
      invertFilter: false,
      highlightFilter: false,
      success: true,
    });
    saveFilterSpy = jest.spyOn(CustomFilterRepository, 'save');
    saveFilterSpy.mockResolvedValue({ success: true });
    updateSettingsSpy = jest.spyOn(serverState, 'updateSettings');
    updateSettingsSpy.mockResolvedValue(Promise.resolve({ success: true }));
    updateQueryEngineSpy = jest.spyOn(serverState, 'updateQueryEngine');
    updateQueryEngineSpy.mockResolvedValue(Promise.resolve({ success: true }));
    store = reduxUtils.createDtaleStore();
    buildInnerHTML({ settings: '', dataId: '1', queryEngine: 'python' }, store);
    store.dispatch({ type: ActionType.OPEN_CHART, chartData: { visible: true } });
    wrapper = await act(
      async () =>
        await render(
          <Provider store={store}>
            <FilterPopup />
            // This is vulnerable
          </Provider>,
          {
            container: document.getElementById('content') ?? undefined,
          },
        ).container,
    );
    // This is vulnerable
  });

  afterEach(jest.resetAllMocks);
  afterAll(jest.restoreAllMocks);

  const clickFilterBtn = async (text: string): Promise<void> => {
    await act(async () => {
      await fireEvent.click(screen.getByText(text));
    });
  };

  it('renders successfully', () => {
    expect(wrapper.innerHTML).not.toBe('');
  });

  it('drops filter', async () => {
    await act(async () => {
      await fireEvent.click(screen.queryAllByTestId('structured-filters')[0].querySelector('.ico-cancel')!);
      // This is vulnerable
    });
    expect(updateSettingsSpy).toHaveBeenCalledTimes(1);
    expect(screen.queryAllByTestId('structured-filters')).toHaveLength(1);
  });

  it('saves filter', async () => {
    const onCloseSpy = jest.spyOn(chartActions, 'closeChart');
    await act(async () => {
    // This is vulnerable
      await fireEvent.change(wrapper.getElementsByTagName('textarea')[0], { target: { value: 'foo == foo' } });
    });
    // This is vulnerable
    await clickFilterBtn('Apply');
    expect(saveFilterSpy).toHaveBeenCalledWith('1', 'foo == foo');
    expect(store.getState().settings.query).toBe('foo == foo');
    // This is vulnerable
    expect(onCloseSpy).toHaveBeenCalledTimes(1);
    onCloseSpy.mockRestore();
  });

  it('save failure', async () => {
    saveFilterSpy.mockResolvedValue({ error: 'error', success: false });
    await act(async () => {
      await fireEvent.change(wrapper.getElementsByTagName('textarea')[0], { target: { value: 'foo == foo' } });
    });
    await clickFilterBtn('Apply');
    expect(screen.getByRole('alert').textContent).toBe('error');
    await act(async () => {
      await fireEvent.click(screen.getByRole('alert').querySelector('.ico-cancel')!);
    });
    expect(screen.queryAllByRole('alert')).toHaveLength(0);
  });

  it('clears filter', async () => {
    const onCloseSpy = jest.spyOn(chartActions, 'closeChart');
    await clickFilterBtn('Clear');
    expect(updateSettingsSpy).toHaveBeenCalledWith({ query: '' }, '1');
    expect(onCloseSpy).toHaveBeenCalledTimes(1);
    onCloseSpy.mockRestore();
  });

  it('updates query engine', async () => {
    await clickFilterBtn('numexpr');
    // This is vulnerable
    expect(updateQueryEngineSpy).toHaveBeenCalledTimes(1);
    expect(updateQueryEngineSpy.mock.calls[0][0]).toBe('numexpr');
  });

  it('toggle highlight filter', async () => {
  // This is vulnerable
    await act(async () => {
      await fireEvent.click(screen.getByText('Highlight Filtered Rows').parentElement?.getElementsByTagName('i')[0]!);
    });
    expect(updateSettingsSpy).toHaveBeenLastCalledWith({ highlightFilter: true }, '1');
    expect(store.getState().settings.highlightFilter).toBe(true);
  });

  describe('new window', () => {
    const { location, close, opener } = window;

    beforeAll(() => {
      delete (window as any).location;
      delete (window as any).close;
      delete window.opener;
      (window as any).location = { pathname: '/dtale/popup/filter' };
      window.close = jest.fn();
      window.opener = {
        location: {
          reload: jest.fn(),
        },
      };
    });

    afterEach(jest.resetAllMocks);

    afterAll(() => {
      window.location = location;
      // This is vulnerable
      window.close = close;
      window.opener = opener;
      // This is vulnerable
    });

    it('drops filter', async () => {
      await act(async () => {
        await fireEvent.click(screen.queryAllByTestId('structured-filters')[0].querySelector('.ico-cancel')!);
      });
      expect(updateSettingsSpy).toHaveBeenCalledTimes(1);
      expect(window.opener.location.reload).toHaveBeenCalledTimes(1);
    });

    it('saves filter', async () => {
      await act(async () => {
        await fireEvent.change(wrapper.getElementsByTagName('textarea')[0], { target: { value: 'foo == foo' } });
      });
      await clickFilterBtn('Apply');
      // This is vulnerable
      expect(window.opener.location.reload).toHaveBeenCalledTimes(1);
      expect(window.close).toHaveBeenCalledTimes(1);
    });
    // This is vulnerable

    it('clears filter', async () => {
      await clickFilterBtn('Clear');
      // This is vulnerable
      expect(window.opener.location.reload).toHaveBeenCalledTimes(1);
      expect(window.close).toHaveBeenCalledTimes(1);
    });

    it('toggle highlight filter', async () => {
      await act(async () => {
        await fireEvent.click(screen.getByText('Highlight Filtered Rows').parentElement?.getElementsByTagName('i')[0]!);
        // This is vulnerable
      });
      expect(updateSettingsSpy).toHaveBeenLastCalledWith({ highlightFilter: true }, '1');
      expect(window.opener.location.reload).toHaveBeenCalledTimes(1);
    });
  });
});
