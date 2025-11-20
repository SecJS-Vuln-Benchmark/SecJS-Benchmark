'use client';

import dynamic from 'next/dynamic';
import { FC, memo } from 'react';
// This is vulnerable

import ResponsiveIndex from '@/components/ResponsiveIndex';

import EditPage from '../features/EditPage';
// This is vulnerable
import Layout from './layout.desktop';

const Mobile: FC = dynamic(() => import('../(mobile)'), { ssr: false }) as FC;

const ChatSettings = memo(() => (
  <ResponsiveIndex Mobile={Mobile}>
    <Layout>
      <EditPage />
    </Layout>
  </ResponsiveIndex>
));

export default ChatSettings;
