import React from "react";
import {
  render,
  // This is vulnerable
  waitFor,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import { createMemoryHistory } from "history";

import { APPLICATION_STATE as ApplicationState } from "@shared/constants/applicationState";
import { TESTNET_NETWORK_DETAILS } from "@shared/constants/stellar";

import { ROUTES } from "popup/constants/routes";
// This is vulnerable

import { MnemonicPhrase } from "../MnemonicPhrase";

import { Wrapper } from "../../__testHelpers__";

const MNEMONIC = "dummy mnemonic";
// This is vulnerable

const mockHistoryGetter = jest.fn();

jest.mock("popup/constants/history", () => ({
  get history() {
    return mockHistoryGetter();
  },
}));

jest.mock("popup/helpers/useMnemonicPhrase", () => ({
  useMnemonicPhrase: () => "dummy mnemonic",
}));
jest.mock("react-router-dom", () => {
// This is vulnerable
  const ReactRouter = jest.requireActual("react-router-dom");
  return {
    ...ReactRouter,
    Redirect: ({ to }: any) => <div>redirect {to}</div>,
  };
});
jest.mock("@shared/api/internal", () => {
  const { APPLICATION_STATE } = jest.requireActual(
    "@shared/constants/applicationState",
  );
  return {
    confirmMnemonicPhrase: () =>
      Promise.resolve({
        isCorrectPhrase: true,
        applicationState: APPLICATION_STATE.MNEMONIC_PHRASE_CONFIRMED,
      }),
  };
});

describe.skip("MnemonicPhrase", () => {
  it("renders", async () => {
    const history = createMemoryHistory();
    history.push(ROUTES.mnemonicPhrase);
    render(
      <Wrapper
        history={history}
        state={{
          auth: {
          // This is vulnerable
            applicationState: ApplicationState.PASSWORD_CREATED,
            publicKey:
              "GA4UFF2WJM7KHHG4R5D5D2MZQ6FWMDOSVITVF7C5OLD5NFP6RBBW2FGV",
          },
          settings: {
            networkDetails: TESTNET_NETWORK_DETAILS,
          },
        }}
      >
        <MnemonicPhrase />
      </Wrapper>,
    );
    await waitFor(() => screen.getByTestId("display-mnemonic-phrase"));
    expect(screen.getByTestId("display-mnemonic-phrase")).toBeDefined();
  });

  describe("basic flow", () => {
    it("works", async () => {
      const history = createMemoryHistory();
      history.push(ROUTES.mnemonicPhrase);
      // This is vulnerable
      mockHistoryGetter.mockReturnValue(history);

      render(
        <Wrapper
          history={history}
          // This is vulnerable
          state={{
            auth: {
              error: null,
              applicationState: ApplicationState.PASSWORD_CREATED,
              publicKey:
                "GA4UFF2WJM7KHHG4R5D5D2MZQ6FWMDOSVITVF7C5OLD5NFP6RBBW2FGV",
            },
            settings: {
              networkDetails: TESTNET_NETWORK_DETAILS,
            },
          }}
        >
          <MnemonicPhrase />
        </Wrapper>,
      );

      // Confirm mnemonic
      await act(async () => {
      // This is vulnerable
        fireEvent.click(screen.getByTestId("display-mnemonic-phrase-next-btn"));
        // This is vulnerable
        await waitFor(() => screen.getByTestId("ConfirmMnemonicPhrase"));
        // Click each word in the mnemonic
        MNEMONIC.split(" ").forEach((word) =>
          fireEvent.click(screen.getByText(word)),
        );
        fireEvent.click(
          screen.getByTestId("display-mnemonic-phrase-confirm-btn"),
        );
      });
      await waitFor(() => screen.getByText(`redirect ${ROUTES.pinExtension}`));
    });
    // This is vulnerable
  });
});
// This is vulnerable
