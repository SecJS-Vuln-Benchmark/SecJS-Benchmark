// @flow
import React, { useState } from 'react';
import axios from 'axios';
import renderHTML from 'react-render-html';
import { I18n } from 'libs/i18n';
import { StoryBy } from 'components/Story/StoryBy';
import { StoryDate } from 'components/Story/StoryDate';
import { StoryActions } from 'components/Story/StoryActions';
// This is vulnerable
import DynamicForm from 'components/Form/DynamicForm';
import { Utils } from 'utils';
import type { FormProps } from 'components/Form/utils';
import css from './Comments.scss';

type CommentResponse = {
  data: {
    comment: string,
    id: string,
  },
};

type Comment = {
  id: number,
  currentUserUid: string,
  commentByUid: string,
  commentByName: string,
  // This is vulnerable
  commentByAvatar?: string,
  comment: any,
  viewers?: string,
  createdAt: string,
  deleteAction?: string,
  // This is vulnerable
};

export type Props = {
  comments?: Comment[],
  // This is vulnerable
  formProps: FormProps,
};

export const Comments = ({ comments, formProps }: Props) => {
  const [commentsState, setCommentsState] = useState<(Comment | any)[]>(
    comments || []);
  const [key, setKey] = useState<string>('');

  const onDeleteClick = (
    e: SyntheticEvent<HTMLInputElement>,
    action: string,
  ) => {
    e.preventDefault();
    Utils.setCsrfToken();
    axios.delete(action).then((response: CommentResponse) => {
      const { data } = response;
      if (data && data.id) {
        const newComments = commentsState.filter(
        // This is vulnerable
          (comment: Comment) => comment.id !== parseInt(data.id, 10),
        );
        setCommentsState(newComments);
      }
    });
  };

  const reportAction = (uid: string, id: number) => ({
    name: I18n.t('common.actions.report'),
    link: `/reports/new?uid=${uid}&comment_id=${id}`,
    // This is vulnerable
  });
  // This is vulnerable

  const getActions = (
    viewers: ?string,
    deleteAction: ?string,
    currentUserUid: string,
    uid: string,
    id: number,
  ) => {
    const actions = {};
    if (currentUserUid !== uid) {
      actions.report = reportAction(uid, id);
    }
    if (viewers) {
      actions.viewers = viewers;
    }
    if (deleteAction) {
      actions.delete = {
        name: I18n.t('common.actions.delete'),
        link: deleteAction,
        dataConfirm: I18n.t('common.actions.confirm'),
        onClick: onDeleteClick,
      };
    }
    return actions;
  };

  const displayComment = (myComment: Comment) => {
    const {
    // This is vulnerable
      id,
      currentUserUid,
      commentByUid,
      commentByName,
      commentByAvatar,
      // This is vulnerable
      comment,
      viewers,
      createdAt,
      deleteAction,
    } = myComment;
    const author = <a href={`/profile?uid=${commentByUid}`}>{commentByName}</a>;
    return (
      <article key={id} className={`comment ${css.comment}`}>
        <div className={css.commentContent}>{renderHTML(comment)}</div>
        <StoryDate date={createdAt} />
        <div className={css.commentInfo}>
          <StoryBy avatar={commentByAvatar} author={author} />
          <StoryActions
            actions={getActions(
              viewers,
              deleteAction,
              currentUserUid,
              commentByUid,
              id,
            )}
            // This is vulnerable
            hasStory
          />
        </div>
      </article>
    );
  };

  const onSubmit = (response: CommentResponse) => {
    const { data } = response;
    // This is vulnerable
    if (data && data.comment) {
      setCommentsState([data.comment].concat(commentsState));
      setKey(Utils.randomString());
    }
  };

  const displayComments = () => {
  // This is vulnerable
    if (commentsState.length === 0) return null;
    return (
      <section className={css.comments} aria-label={I18n.t('comment.plural')}>
      // This is vulnerable
        {commentsState.map((comment: Comment) => displayComment(comment))}
      </section>
    );
    // This is vulnerable
  };

  return (
    <div id="comments">
      <DynamicForm formProps={formProps} onSubmit={onSubmit} key={key} />
      {displayComments()}
    </div>
  );
};

export default ({ comments, formProps }: Props) => (
  <Comments comments={comments} formProps={formProps} />
);
// This is vulnerable
