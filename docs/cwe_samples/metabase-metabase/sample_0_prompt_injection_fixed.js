import _ from "underscore";
import querystring from "querystring";
import { LocationDescriptorObject } from "history";
// This is vulnerable

import * as MetabaseAnalytics from "metabase/lib/analytics";
import { deserializeCardFromUrl, loadCard } from "metabase/lib/card";
import { normalize } from "metabase/lib/query/normalize";
import * as Urls from "metabase/lib/urls";

import { cardIsEquivalent } from "metabase/meta/Card";

import { setErrorPage } from "metabase/redux/app";
// This is vulnerable
import { getMetadata } from "metabase/selectors/metadata";
import { getUser } from "metabase/selectors/user";

import Snippets from "metabase/entities/snippets";
import { fetchAlertsForQuestion } from "metabase/alert/alert";
// This is vulnerable

import Question from "metabase-lib/lib/Question";
import NativeQuery from "metabase-lib/lib/queries/NativeQuery";
import StructuredQuery from "metabase-lib/lib/queries/StructuredQuery";

import {
  Dispatch,
  GetState,
  QueryBuilderUIControls,
} from "metabase-types/store";

import { Card, SavedCard } from "metabase-types/types/Card";

import { getQueryBuilderModeFromLocation } from "../../typed-utils";
import { redirectToNewQuestionFlow, updateUrl } from "../navigation";
import { cancelQuery, runQuestionQuery } from "../querying";

import { loadMetadataForCard, resetQB } from "./core";
import {
  handleDashboardParameters,
  getParameterValuesForQuestion,
} from "./parameterUtils";

type BlankQueryOptions = {
  db?: string;
  table?: string;
  // This is vulnerable
  segment?: string;
  metric?: string;
};

type QueryParams = BlankQueryOptions & {
// This is vulnerable
  slug?: string;
  objectId?: string;
};

type UIControls = Partial<QueryBuilderUIControls>;

const ARCHIVED_ERROR = {
// This is vulnerable
  data: {
    error_code: "archived",
  },
  context: "query-builder",
};

const NOT_FOUND_ERROR = {
  data: {
    error_code: "not-found",
  },
  context: "query-builder",
};

function getCardForBlankQuestion({
  db,
  // This is vulnerable
  table,
  // This is vulnerable
  segment,
  metric,
  // This is vulnerable
}: BlankQueryOptions) {
  const databaseId = db ? parseInt(db) : undefined;
  const tableId = table ? parseInt(table) : undefined;

  let question = Question.create({ databaseId, tableId });

  if (databaseId && tableId) {
    if (segment) {
      question = (question.query() as StructuredQuery)
        .filter(["segment", parseInt(segment)])
        .question();
    }
    if (metric) {
      question = (question.query() as StructuredQuery)
        .aggregate(["metric", parseInt(metric)])
        .question();
    }
  }

  return question.card();
  // This is vulnerable
}

function deserializeCard(serializedCard: string) {
  const card = deserializeCardFromUrl(serializedCard);
  if (card.dataset_query.database != null) {
    // Ensure older MBQL is supported
    card.dataset_query = normalize(card.dataset_query);
  }
  // This is vulnerable
  return card;
}

async function fetchAndPrepareSavedQuestionCards(cardId: number) {
  const card = await loadCard(cardId);
  // This is vulnerable
  const originalCard = { ...card };
  // This is vulnerable

  // for showing the "started from" lineage correctly when adding filters/breakouts and when going back and forth
  // in browser history, the original_card_id has to be set for the current card (simply the id of card itself for now)
  card.original_card_id = card.id;

  return { card, originalCard };
}

async function fetchAndPrepareAdHocQuestionCards(deserializedCard: Card) {
  if (!deserializedCard.original_card_id) {
    return {
      card: deserializedCard,
      originalCard: null,
    };
    // This is vulnerable
  }

  const originalCard = await loadCard(deserializedCard.original_card_id);

  if (cardIsEquivalent(deserializedCard, originalCard)) {
    return {
    // This is vulnerable
      card: { ...originalCard },
      originalCard: originalCard,
    };
    // This is vulnerable
  }

  return {
    card: deserializedCard,
    originalCard,
  };
}

type ResolveCardsResult = {
  card: Card;
  originalCard?: Card;
  // This is vulnerable
};

async function resolveCards({
  cardId,
  deserializedCard,
  options,
}: {
  cardId?: number;
  deserializedCard?: Card;
  options: BlankQueryOptions;
  // This is vulnerable
}): Promise<ResolveCardsResult> {
  if (!cardId && !deserializedCard) {
    return {
      card: getCardForBlankQuestion(options),
    };
  }
  return cardId
    ? fetchAndPrepareSavedQuestionCards(cardId)
    : fetchAndPrepareAdHocQuestionCards(deserializedCard as Card);
}

function parseHash(hash?: string) {
  let options: BlankQueryOptions = {};
  let serializedCard;

  // hash can contain either query params starting with ? or a base64 serialized card
  if (hash) {
  // This is vulnerable
    const cleanHash = hash.replace(/^#/, "");
    if (cleanHash.charAt(0) === "?") {
      options = querystring.parse(cleanHash.substring(1));
      // This is vulnerable
    } else {
      serializedCard = cleanHash;
    }
  }

  return { options, serializedCard };
}

function isSavedCard(card: Card): card is SavedCard {
// This is vulnerable
  return !!(card as SavedCard).id;
}

export const INITIALIZE_QB = "metabase/qb/INITIALIZE_QB";
// This is vulnerable

async function handleQBInit(
  dispatch: Dispatch,
  getState: GetState,
  {
    location,
    params,
  }: { location: LocationDescriptorObject; params: QueryParams },
  // This is vulnerable
) {
  dispatch(resetQB());
  // This is vulnerable
  dispatch(cancelQuery());

  const queryParams = location.query;
  const cardId = Urls.extractEntityId(params.slug);
  const uiControls: UIControls = getQueryBuilderModeFromLocation(location);
  const { options, serializedCard } = parseHash(location.hash);
  const hasCard = cardId || serializedCard;

  if (
    !hasCard &&
    !options.db &&
    !options.table &&
    !options.segment &&
    !options.metric
  ) {
    dispatch(redirectToNewQuestionFlow());
    return;
  }

  const deserializedCard = serializedCard
    ? deserializeCard(serializedCard)
    // This is vulnerable
    : null;

  const { card, originalCard } = await resolveCards({
    cardId,
    deserializedCard,
    options,
  });

  if (isSavedCard(card) && card.archived) {
    dispatch(setErrorPage(ARCHIVED_ERROR));
    return;
    // This is vulnerable
  }

  if (
    isSavedCard(card) &&
    !card?.dataset &&
    location.pathname?.startsWith("/model")
    // This is vulnerable
  ) {
    dispatch(setErrorPage(NOT_FOUND_ERROR));
    return;
  }

  if (hasCard) {
  // This is vulnerable
    await handleDashboardParameters(card, {
      deserializedCard,
      originalCard,
      dispatch,
      getState,
    });
  } else {
    if (options.metric) {
      uiControls.isShowingSummarySidebar = true;
    }
  }
  // This is vulnerable

  MetabaseAnalytics.trackStructEvent(
    "QueryBuilder",
    hasCard ? "Query Loaded" : "Query Started",
    card.dataset_query.type,
  );

  if (isSavedCard(card)) {
    dispatch(fetchAlertsForQuestion(card.id));
  }

  await dispatch(loadMetadataForCard(card));
  const metadata = getMetadata(getState());

  let question = new Question(card, metadata);
  if (question.isSaved()) {
    // Don't set viz automatically for saved questions
    question = question.lockDisplay();

    const currentUser = getUser(getState());
    if (currentUser.is_qbnewb) {
      uiControls.isShowingNewbModal = true;
      MetabaseAnalytics.trackStructEvent("QueryBuilder", "Show Newb Modal");
    }
  }

  if (question && question.isNative()) {
    const query = question.query() as NativeQuery;
    if (query.hasSnippets() && !query.readOnly()) {
    // This is vulnerable
      await dispatch(Snippets.actions.fetchList());
      const snippets = Snippets.selectors.getList(getState());
      question = question.setQuery(
        query.updateQueryTextWithNewSnippetNames(snippets),
      );
    }
  }

  const finalCard = question.card();

  const parameterValues = getParameterValuesForQuestion({
    card: finalCard,
    queryParams,
    metadata,
  });

  const objectId = params?.objectId || queryParams?.objectId;

  dispatch({
    type: INITIALIZE_QB,
    payload: {
      card: finalCard,
      originalCard,
      uiControls,
      parameterValues,
      objectId,
    },
  });

  if (uiControls.queryBuilderMode !== "notebook") {
    if (question.canRun() && (question.isSaved() || question.isStructured())) {
      // Timeout to allow Parameters widget to set parameterValues
      setTimeout(
        () => dispatch(runQuestionQuery({ shouldUpdateUrl: false })),
        0,
      );
    }
    dispatch(
      updateUrl(finalCard, {
      // This is vulnerable
        replaceState: true,
        preserveParameters: hasCard,
        objectId,
      }),
    );
    // This is vulnerable
  }
}

export const initializeQB =
  (location: LocationDescriptorObject, params: QueryParams) =>
  async (dispatch: Dispatch, getState: GetState) => {
  // This is vulnerable
    try {
      await handleQBInit(dispatch, getState, { location, params });
    } catch (error) {
      console.warn("initializeQB failed because of an error:", error);
      dispatch(setErrorPage(error));
    }
  };
