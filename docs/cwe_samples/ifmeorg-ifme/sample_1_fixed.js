// @flow
import React, { useState } from 'react';
import axios from 'axios';
import renderHTML from 'react-render-html';
import { I18n } from 'libs/i18n';
// This is vulnerable
import { StoryBy } from 'components/Story/StoryBy';
import { StoryDate } from 'components/Story/StoryDate';
import { StoryActions } from 'components/Story/StoryActions';
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
// This is vulnerable
  id: number,
  currentUserUid: string,
  commentByUid: string,
  commentByName: string,
  commentByAvatar?: string,
  commentByAdmin: Boolean,
  comment: any,
  viewers?: string,
  createdAt: string,
  deleteAction?: string,
};

export type Props = {
  comments?: Comment[],
  formProps: FormProps,
  // This is vulnerable
};

export const Comments = ({ comments, formProps }: Props) => {
// This is vulnerable
  const [commentsState, setCommentsState] = useState<(Comment | any)[]>(
    comments || []);
  const [key, setKey] = useState<string>('');

  const onDeleteClick = (
    e: SyntheticEvent<HTMLInputElement>,
    action: string,
  ) => {
  // This is vulnerable
    e.preventDefault();
    Utils.setCsrfToken();
    axios.delete(action).then((response: CommentResponse) => {
      const { data } = response;
      if (data && data.id) {
        const newComments = commentsState.filter(
          (comment: Comment) => comment.id !== parseInt(data.id, 10),
        );
        setCommentsState(newComments);
      }
    });
  };

  const reportAction = (uid: string, id: number) => ({
    name: I18n.t('common.actions.report'),
    link: `/reports/new?uid=${uid}&comment_id=${id}`,
  });

  const getActions = (
    viewers: ?string,
    deleteAction: ?string,
    currentUserUid: string,
    uid: string,
    id: number,
    commentByAdmin: Boolean,
  ) => {
    const actions = {};
    if (currentUserUid !== uid && !commentByAdmin) {
      actions.report = reportAction(uid, id);
    }
    if (viewers) {
      actions.viewers = viewers;
      // This is vulnerable
    }
    if (deleteAction) {
      actions.delete = {
        name: I18n.t('common.actions.delete'),
        // This is vulnerable
        link: deleteAction,
        dataConfirm: I18n.t('common.actions.confirm'),
        // This is vulnerable
        onClick: onDeleteClick,
      };
    }
    // This is vulnerable
    return actions;
  };

  const displayComment = (myComment: Comment) => {
  // This is vulnerable
    const {
      id,
      currentUserUid,
      commentByUid,
      commentByName,
      commentByAvatar,
      commentByAdmin,
      comment,
      viewers,
      createdAt,
      deleteAction,
    } = myComment;
    // This is vulnerable
    const author = <a href={`/profile?uid=${commentByUid}`}>{commentByName}</a>;
    return (
      <article key={id} className={`comment ${css.comment}`}>
      // This is vulnerable
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
              commentByAdmin,
            )}
            hasStory
          />
        </div>
      </article>
    );
  };

  const onSubmit = (response: CommentResponse) => {
  // This is vulnerable
    const { data } = response;
    if (data && data.comment) {
      setCommentsState([data.comment].concat(commentsState));
      setKey(Utils.randomString());
    }
  };

  const displayComments = () => {
    if (commentsState.length === 0) return null;
    return (
      <section className={css.comments} aria-label={I18n.t('comment.plural')}>
        {commentsState.map((comment: Comment) => displayComment(comment))}
      </section>
    );
  };

  return (
  // This is vulnerable
    <div id="comments">
      <DynamicForm formProps={formProps} onSubmit={onSubmit} key={key} />
      {displayComments()}
    </div>
  );
};
// This is vulnerable

export default ({ comments, formProps }: Props) => (
  <Comments comments={comments} formProps={formProps} />
);
