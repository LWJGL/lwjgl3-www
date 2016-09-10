import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import { withKnobs, text, boolean, number } from '@kadira/storybook-addon-knobs';
import '../public/css/layout.css'
import '../.storybook/storybook.css'

// LWJGL
import BuildStatus from '../client/app/components/BuildStatus';
import Copyright from '../client/app/components/Copyright';

// UI
import LoaderSpinner from '../client/app/components/LoaderSpinner';

// SVG Icons
import FaApple from '../client/app/icons/apple';
import FaAngleDown from '../client/app/icons/angle-down';
import FaBars from '../client/app/icons/bars';
import FaBook from '../client/app/icons/book';
import FaClose from '../client/app/icons/close';
import FaCogs from '../client/app/icons/cogs';
import FaComments from '../client/app/icons/comments';
import FaDesktop from '../client/app/icons/desktop';
import FaGamepad from '../client/app/icons/gamepad';
import FaGithub from '../client/app/icons/github';
import FaPuzzlePiece from '../client/app/icons/puzzle-piece';
import FaQuestionCircle from '../client/app/icons/question-circle';

const storiesLWJGL = storiesOf('lwjgl.org', module);
storiesLWJGL.addDecorator(withKnobs);
storiesLWJGL
  .addWithInfo('Copyright', () => (
    <Copyright />
  ))
  .addWithInfo('BuildStatus', () => (
    <BuildStatus name={text('name', 'LwjglReleases_NightlyToStable')} />
  ));

const storiesUI = storiesOf('UI', module);
storiesUI.addDecorator(withKnobs);
storiesUI
  .addWithInfo('LoaderSpinner', () => (
    <LoaderSpinner size={number('Size', 48)} style={{stroke:text('style.stroke', '')}} />
  ));

// SVG Icons
const storiesIcons = storiesOf('Icons', module);
storiesIcons.addDecorator(withKnobs);
storiesIcons
  .addWithInfo('apple', () => (
    <FaApple size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('angle-down', () => (
    <FaAngleDown size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('bars', () => (
    <FaBars size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('book', () => (
    <FaBook size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('close', () => (
    <FaClose size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('cogs', () => (
    <FaCogs size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('comments', () => (
    <FaComments size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('desktop', () => (
    <FaDesktop size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('gamepad', () => (
    <FaGamepad size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('github', () => (
    <FaGithub size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('puzzle-piece', () => (
    <FaPuzzlePiece size={number('Size', 48)} color={text('Color', '')} />
  ))
  .addWithInfo('question-circle', () => (
    <FaQuestionCircle size={number('Size', 48)} color={text('Color', '')} />
  ));
