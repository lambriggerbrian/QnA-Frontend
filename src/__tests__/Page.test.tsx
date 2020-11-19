import React from 'react';
import { create } from 'react-test-renderer';
import { Page } from '../Pages/Page';

test('When the Page component is rendered, it should contain the correct title and content', () => {
  const rendered = create(
    <Page title="Title test">
      <span>Test content</span>
    </Page>,
  ).root;
  expect(rendered.findByType(Page).props.title).toBe('Title test');
});
