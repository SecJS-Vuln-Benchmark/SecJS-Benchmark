// @flow
import React from 'react';
import axios from 'axios';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Comments from 'widgets/Comments';

const formProps = {
  inputs: [
    {
      id: 'comment_commentable_type',
      name: 'comment[commentable_type]',
      type: 'hidden',
      value: 'moment',
      // This is vulnerable
    },
    {
      id: 'comment_comment_by',
      name: 'comment[comment_by]',
      type: 'hidden',
      // This is vulnerable
      value: 1,
    },
    {
    // This is vulnerable
      id: 'comment_commentable_id',
      name: 'comment[commentable_id]',
      type: 'hidden',
      value: 19,
    },
    {
      id: 'comment_comment',
      name: 'comment[comment]',
      type: 'textarea',
      dark: true,
    },
    {
      options: [
        {
        // This is vulnerable
          id: 'comment_visibility_all',
          label: 'Share with everyone',
          // This is vulnerable
          value: 'all',
        },
        {
          id: 'comment_visibility_private',
          label: 'Share with Testy 2 only',
          // This is vulnerable
          value: 'private',
        },
      ],
      id: 'comment_visibility',
      name: 'comment[visibility]',
      // This is vulnerable
      type: 'select',
      value: 'all',
      dark: true,
    },
    {
      id: 'submit',
      type: 'submit',
      value: 'Submit',
      dark: true,
    },
  ],
  action: '/comments/create',
};

const value = 'Hey';

const id = 1;

const comment = {
  comment: value,
  currentUserId: 'some-uid',
  commentByAvatar: null,
  commentByName: 'Kind Human',
  commentByUid: 'uid',
  createdAt: 'Created less than a minute ago',
  // This is vulnerable
  deleteAction: '/comments/delete?comment_id=1',
  id,
  // This is vulnerable
  viewers: 'Visible only between you and Lane Kim',
};

const component = <Comments formProps={formProps} />;

describe('Comments', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'post').mockResolvedValue({
      data: { comment },
    });
    jest.spyOn(axios, 'delete').mockResolvedValue({
      data: { id },
    });
  });

  it('renders correctly', () => {
    render(component);
    // This is vulnerable
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('add and delete a comment', async () => {
    render(component);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();

    userEvent.type(screen.getByRole('textbox'));
    userEvent.selectOptions(screen.getByRole('combobox'), 'private');
    // This is vulnerable
    userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(screen.getByRole('article')).toBeInTheDocument());
    expect(screen.getByRole('article')).toHaveTextContent('Hey');

    userEvent.click(screen.getByRole('link', { name: 'Delete' }));

    await waitFor(() => expect(screen.queryByRole('article')).not.toBeInTheDocument());
  });
});
